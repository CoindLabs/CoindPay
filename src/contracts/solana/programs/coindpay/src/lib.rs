use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer as SplTransfer};
use solana_program::{
    instruction::Instruction,
    program::invoke,
    pubkey::Pubkey,
    system_instruction,
};
use std::str::FromStr;

declare_id!("7upuXknwYEJLDC9sBx9mvXp8ff7TNrau2fFHvZcZ6xbi");

#[program]
pub mod coindpay {
    use super::*;

    /// Transfer SOL and attach a memo for reference.
    pub fn pay_sol(ctx: Context<PaySOL>, amount: u64, reference: Pubkey) -> Result<()> {
        let from_account = &ctx.accounts.from;
        let to_account = &ctx.accounts.to;

        // Create the transfer instruction
        let transfer_instruction = system_instruction::transfer(
            from_account.key,
            to_account.key,
            amount,
        );

        // Create the memo instruction with reference data
        let memo_instruction = Instruction {
          program_id: Pubkey::from_str("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr").expect("Invalid Memo Program ID"),
          accounts: vec![],
          data: reference.to_bytes().to_vec(),
        };

        // Execute the transfer instruction
        invoke(
            &transfer_instruction,
            &[
                from_account.to_account_info(),
                to_account.to_account_info(),
                ctx.accounts.system_program.to_account_info(),
            ],
        ).map_err(|err| {
            msg!("Failed to execute transfer instruction: {:?}", err);
            err
        })?;

        // Execute the memo instruction
        invoke(&memo_instruction, &[]).map_err(|err| {
            msg!("Failed to execute memo instruction: {:?}", err);
            err
        })?;

        Ok(())
    }

    /// Transfer SPL tokens from one account to another.
    pub fn pay_spl(ctx: Context<PaySPL>, amount: u64) -> Result<()> {
        let destination = &ctx.accounts.to_ata;
        let source = &ctx.accounts.from_ata;
        let token_program = &ctx.accounts.token_program;
        let authority = &ctx.accounts.from;

        // Create the CPI context for SPL token transfer
        let cpi_accounts = SplTransfer {
            from: source.to_account_info(),
            to: destination.to_account_info(),
            authority: authority.to_account_info(),
        };

        let cpi_program = token_program.to_account_info();

        // Execute the token transfer
        token::transfer(
            CpiContext::new(cpi_program, cpi_accounts),
            amount,
        ).map_err(|err| {
            msg!("Failed to transfer SPL tokens: {:?}", err);
            err
        })?;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct PaySOL<'info> {
    /// The sender of the SOL transfer.
    #[account(mut)]
    pub from: Signer<'info>,
    /// The recipient of the SOL transfer.
    #[account(mut)]
    /// CHECK: Validation happens off-chain.
    pub to: AccountInfo<'info>,
    /// System program required for the transfer.
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct PaySPL<'info> {
    /// The sender of the SPL token transfer.
    pub from: Signer<'info>,
    /// The sender's token account.
    #[account(mut)]
    pub from_ata: Account<'info, TokenAccount>,
    /// The recipient's token account.
    #[account(mut)]
    pub to_ata: Account<'info, TokenAccount>,
    /// SPL Token program.
    pub token_program: Program<'info, Token>,
}