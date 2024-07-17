import {
  Commitment,
  ConfirmOptions,
  Connection,
  SignatureStatus,
  Transaction,
  Signer,
  TransactionSignature,
} from '@solana/web3.js'

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export class TransactionDroppedError extends Error {
  message: string
  transaction_signature: string

  constructor({ transaction_signature, message }: { transaction_signature: string; message?: string }) {
    super()
    this.message = message ?? ''
    this.transaction_signature = transaction_signature
  }
}

export class TimeoutError extends Error {
  message: string
  transaction_signature: string

  constructor({ transaction_signature, message }: { transaction_signature: string; message?: string }) {
    super()
    this.message = message ?? ''
    this.transaction_signature = transaction_signature
  }
}

const max_time = 8640000000000000
/**
 *
 * @returns the number of milliseconds from unix epoch
 */
function getTimestamp(): number {
  return new Date().getTime()
}

const confirmationStatusList = new Map<Commitment, Commitment[]>([
  ['finalized', ['finalized']],
  ['confirmed', ['finalized', 'confirmed']],
  ['processed', ['confirmed', 'finalized', 'processed']],
])

/**
 * confirm a transaction.
 * @param connection solana connection
 * @param lastValidBlockHeight block height from the getLatestBlockHash
 * @param signature signature of the transaciton
 * @param commitment commitment required
 * @param timeout_in_ms time out. wait forever if left unset.
 * @returns the transaction status.
 */
export async function confirmTransaction(
  connection: Connection,
  lastValidBlockHeight: number,
  signature: string,
  commitment: Commitment = 'finalized',
  timeout_in_ms?: number | undefined
): Promise<SignatureStatus> {
  // retry sleep is 0.4 second - solana claimed block time.
  let retry_sleep = 400
  // stop time
  const stop_time = timeout_in_ms ? getTimestamp() + timeout_in_ms : max_time
  const desired_confirms = confirmationStatusList.get(commitment)
  // check for validity of the commitment
  if (desired_confirms === undefined) {
    throw new Error(`unsupported commitment: ${commitment}`)
  }

  // need to catch the rpc failure.
  return await new Promise<SignatureStatus>((resolve, reject) => {
    ;(async () => {
      for (;;) {
        try {
          // get the siganture status
          const result = (await connection.getSignatureStatus(signature)).value

          // result is undefined. the network hasn't seen the signature yet, or
          // the signature is dropped.
          if (!result) {
            // get the block height to see if the transaction is dropped.
            const current_block_height = await connection.getBlockHeight(commitment)
            if (current_block_height > lastValidBlockHeight) {
              reject(
                new TransactionDroppedError({
                  transaction_signature: signature,
                })
              )
              return
            }

            continue
          }

          // if result is err, throw.
          if (result.err) {
            reject(result.err)
            return
          }

          // result is confirmed, but not to the level that we need.
          if (!(result.confirmations || desired_confirms.includes(result.confirmationStatus as Commitment))) {
            const current_block_height = await connection.getBlockHeight(commitment)
            if (current_block_height > lastValidBlockHeight) {
              reject(
                new TransactionDroppedError({
                  transaction_signature: signature,
                })
              )
              return
            }

            continue
          }

          // everything looking good, resolve.
          resolve(result)
          return
        } catch (e) {
          console.log(`RPC error: ${e}`)
        }

        if (getTimestamp() > stop_time) {
          reject(new TimeoutError({ transaction_signature: signature }))
          return
        }

        await sleep(retry_sleep)
        retry_sleep *= 2
      }
    })()
  })
}

/**
 * just like solana web3's sendAndConfirmTransaction, except the confirmation is from the confirmTransaction
 * in this library.
 *
 * @param connection connection to the solana
 * @param transaction transaction to send.
 * @param signers signers
 * @param options options
 * @param timeout_in_ms timeout in milliseconds, default to 60 seconds
 * @returns
 */
export async function sendAndConfirmTransaction(
  connection: Connection,
  transaction: Transaction,
  signers: Array<Signer>,
  options?: ConfirmOptions,
  timeout_in_ms: number = 60000
): Promise<TransactionSignature> {
  if (transaction.nonceInfo) {
    throw new Error('transaction has nonceInfo, and this function is unnecessary')
  }

  const sendOptions = options && {
    skipPreflight: options.skipPreflight,
    preflightCommitment: options.preflightCommitment || options.commitment,
    maxRetries: options.maxRetries,
  }
  const commitment = options?.commitment ?? 'finalized'

  const block_info = await connection.getLatestBlockhash(commitment)

  transaction.recentBlockhash = block_info.blockhash
  transaction.sign(...signers)

  const wire_data = transaction.serialize()

  const signature = await connection.sendRawTransaction(wire_data, options)

  await confirmTransaction(connection, block_info.lastValidBlockHeight, signature, commitment, timeout_in_ms)

  return signature
}
