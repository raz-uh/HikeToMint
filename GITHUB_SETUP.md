# GitHub Setup Instructions

Your HikeToMint repository is now ready for GitHub! Follow these steps to push it to your GitHub account:

## Step 1: Create a New Repository on GitHub

1. Go to [github.com/new](https://github.com/new)
2. Fill in:
   - **Repository name:** `hiketomint` (or `namaste-check`)
   - **Description:** Location-based Soulbound NFT dApp for Solana - Superteam Nepal Bounty
   - **Visibility:** Public (required for bounty)
   - **Skip** adding README, .gitignore (we already have them)
3. Click **"Create repository"**

## Step 2: Push Your Code

Copy and run these commands in your terminal:

```bash
cd /home/kali/superteam/Namaste_check

# Add GitHub remote (replace YOUR_USERNAME with your actual GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/hiketomint.git

# Rename branch to main (optional but recommended)
git branch -m master main

# Push to GitHub
git push -u origin main
```

## Step 3: Verify

Visit `https://github.com/YOUR_USERNAME/hiketomint` and confirm your code is there.

## Next Steps

1. **Update README with links** once you:
   - Deploy frontend to Vercel/Netlify
   - Record demo video on Loom/YouTube
   - Share on X/Twitter and LinkedIn

2. **Add deployment URL** to README:
   ```markdown
   🌐 **Live Deployment:** https://your-vercel-url.vercel.app
   ```

3. **Add demo video URL** to README:
   ```markdown
   📹 **Demo Video:** https://loom.com/share/your-video-id
   ```

## Quick Deploy to Vercel

From the `frontend` directory:

```bash
cd frontend
npm install -g vercel
vercel
# Follow the prompts, grab your deployment URL, update README
```

---

**Once complete, you'll have all required bounty materials ready for submission!**
