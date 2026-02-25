use anchor_lang::prelude::*;
use anchor_spl::{
    token_2022::Token2022,
    token_interface::{MintTo, mint_to},
};
use anchor_lang::solana_program::program::invoke;

declare_id!("Hhf9G9gUrQRjJ1ZPhgrZzj3eAw8mofXtNg21WjtB2Pym");

#[program]
pub mod hike_to_mint {
    use super::*;

    pub fn mint_nft(
        ctx: Context<MintNft>,
        name: String,
        symbol: String,
        uri: String,
    ) -> Result<()> {
        let mint = &ctx.accounts.mint;
        let payer = &ctx.accounts.payer;
        let token_program = &ctx.accounts.token_program;

        // 1. Initialize Non-Transferable Extension
        let init_non_transferable_ix = anchor_spl::token_2022::spl_token_2022::instruction::initialize_non_transferable_mint(
            token_program.key,
            &mint.key(),
        ).map_err(|e| ProgramError::from(e))?;
        
        invoke(
            &init_non_transferable_ix,
            &[mint.to_account_info(), token_program.to_account_info()],
        )?;

        // 2. Initialize Metadata Pointer Extension
        let init_metadata_pointer_ix = anchor_spl::token_2022::spl_token_2022::extension::metadata_pointer::instruction::initialize(
            token_program.key,
            &mint.key(),
            Some(payer.key()),
            Some(mint.key()),
        ).map_err(|e| ProgramError::from(e))?;
        
        invoke(
            &init_metadata_pointer_ix,
            &[mint.to_account_info(), token_program.to_account_info()],
        )?;

        // 3. Initialize Mint
        let init_mint_ix = anchor_spl::token_2022::spl_token_2022::instruction::initialize_mint2(
            token_program.key,
            &mint.key(),
            &payer.key(),
            Some(&payer.key()),
            0,
        ).map_err(|e| ProgramError::from(e))?;
        
        invoke(
            &init_mint_ix,
            &[mint.to_account_info(), token_program.to_account_info()],
        )?;

        // 4. Initialize Metadata
        let init_metadata_ix = spl_token_metadata_interface::instruction::initialize(
            token_program.key,
            &mint.key(),
            &payer.key(),
            &mint.key(),
            &payer.key(),
            name,
            symbol,
            uri,
        );
        
        invoke(
            &init_metadata_ix,
            &[
                mint.to_account_info(),
                payer.to_account_info(),
                token_program.to_account_info(),
            ],
        )?;

        // 5. Mint to Destination
        let cpi_accounts = MintTo {
            mint: mint.to_account_info(),
            to: ctx.accounts.destination.to_account_info(),
            authority: payer.to_account_info(),
        };
        let cpi_ctx = CpiContext::new(token_program.to_account_info(), cpi_accounts);
        mint_to(cpi_ctx, 1)?;

        msg!("Soulbound NFT Minted successfully!");
        Ok(())
    }
}

#[derive(Accounts)]
pub struct MintNft<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    /// CHECK: We initialize this manually
    #[account(mut)]
    pub mint: Signer<'info>,
    /// CHECK: destination
    #[account(mut)]
    pub destination: AccountInfo<'info>,
    pub token_program: Program<'info, Token2022>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}
