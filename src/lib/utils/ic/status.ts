import { CanisterStatus, HttpAgent } from '@dfinity/agent'
import { Principal } from '@dfinity/principal'
import { string2principal } from '../types/principal'

export type CanisterInfo = {
  time: Date
  subnet: null | any
  candid: null | string
  module_hash: string // hex
  controllers: Principal[]
}

export const canister_status = (canister_id: string, host: string = 'https://icp-api.io/'): Promise<CanisterInfo> => {
  return new Promise<CanisterInfo>((resolve, reject) => {
    CanisterStatus.request({
      canisterId: string2principal(canister_id),
      agent: new HttpAgent({
        host,
      }),
      paths: ['time', 'controllers', 'subnet', 'module_hash', 'candid'],
    })
      .then(r => {
        console.error('CanisterStatus', r)
        resolve({
          time: r.get('time') as Date,
          subnet: r.get('subnet'),
          candid: r.get('candid') as string,
          module_hash: r.get('module_hash') as string,
          controllers: r.get('controllers') as Principal[],
        })
      })
      .catch(e => {
        console.error('CanisterStatus error', e)
        reject(e)
      })
  })
}

export const canister_module_hash_and_time = (
  canister_id: string,
  host: string = 'https://icp-api.io/'
): Promise<{
  time: Date
  module_hash: string
}> => {
  return new Promise<{
    time: Date
    module_hash: string
  }>((resolve, reject) => {
    CanisterStatus.request({
      canisterId: string2principal(canister_id),
      agent: new HttpAgent({
        host,
      }),
      paths: ['time', 'module_hash'],
    })
      .then(r => {
        // console.error("CanisterStatus", r);
        resolve({
          time: r.get('time') as Date,
          module_hash: r.get('module_hash') as string,
        })
      })
      .catch(e => {
        // console.error("CanisterStatus error", e);
        reject(e)
      })
  })
}
