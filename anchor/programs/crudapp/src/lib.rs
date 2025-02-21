#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;
// KEYPHRASE: wolf diary attend ankle adjust tape limit story rescue next hint sunny
//NEW KEYPHRASE: usage army nature require void cat relief bargain defy parent verify stem

// Recovered pubkey: "4obQzpxocyxDPDsQpTVfm9HJLAaGM8GAEob69zSvHbtg" 
//                   `"5x6R9iDsC3X4pKsrr336LSMADcxe986n1EboMDLzHA3J"`
// vFi6MhoyWCoszJyf6LXjMRSxNz8pgWgdQSqkqFj41cUJJiH5bmAVMsP3R7UDgDcBkKGAHgBJFgTRzoPZm8QBhm9

declare_id!("8vnmovQPcVrDEc56ZR4DxvFxoYvczs6zutcqqQzgHpWw");
// solana airdrop 1 8vnmovQPcVrDEc56ZR4DxvFxoYvczs6zutcqqQzgHpWw --url https://api.devnet.solana.com
#[program]
pub mod crudapp {
    use super::*;

    pub fn create_journal_entry( // instruction
        ctx: Context<CreateEntry>, 
        title: String,
        message: String
      ) -> Result<()> {
        let journal_entry: &mut Account<JournalEntryState> = &mut ctx.accounts.journal_entry;
        journal_entry.owner = *ctx.accounts.owner.key;
        journal_entry.title = title;
        journal_entry.message = message;
        
        Ok(())
      }

      pub fn update_journal_entry(ctx: Context<UpdateEntry>, _title: String, message: String) -> Result<()> {
        let journal_entry: &mut Account<JournalEntryState> = &mut ctx.accounts.journal_entry;
            journal_entry.message = message;

            Ok(())
      }


      pub fn delete_journal_entry(_ctx: Context<DeleteEntry>, _title: String) -> Result<()> {

        Ok(())
      }
}

// D.S.A to create Jounal_Entry instruction.
// CreateEntry struct
#[derive(Accounts)]
#[instruction(title: String)] // to show you are pulling the title from the instruction which is "create_journal_entry"
// # implentations
pub struct CreateEntry<'info> {
  #[account(
    init,
    seeds = [title.as_bytes(), owner.key().as_ref()],
    bump,
    space = 8 + JournalEntryState::INIT_SPACE,
    payer = owner,
  )]
  pub journal_entry: Account<'info, JournalEntryState>,

  #[account(mut)]
  pub owner: Signer<'info>,

  pub system_program: Program<'info, System>,
}
// D.S.A. for update account.
#[derive(Accounts)]
#[instruction(title: String)]
// #implementation
pub struct UpdateEntry<'info> {
  #[account(
    mut,
    seeds = [title.as_bytes(), owner.key().as_ref()],
    bump,
    realloc = 8 + JournalEntryState::INIT_SPACE,
    realloc::payer = owner,
    realloc::zero = true,
  )]
  pub journal_entry: Account<'info, JournalEntryState>,

  #[account(mut)]
  pub owner: Signer<'info>,

  pub system_program: Program<'info, System>,

}

#[derive(Accounts)]
#[instruction(title: String)]
// #implementation
pub struct DeleteEntry<'info> {
  #[account(
    mut,
    seeds = [title.as_bytes(), owner.key().as_ref()],
    bump,
    close = owner,
  )]
  pub journal_entry: Account<'info, JournalEntryState>,

  #[account(mut)]
  pub owner: Signer<'info>,

  pub system_program: Program<'info, System>,
}

// DATA STRUCTURE
#[derive(InitSpace)] // To calculate how much space is onchain.
#[account]// # implentation
pub struct JournalEntryState {
  pub owner: Pubkey,
  #[max_len(50)]
  pub title: String,
  #[max_len(1000)]
  pub message: String
  }


