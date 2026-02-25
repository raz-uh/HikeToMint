# HikeToMint - Nepal's On-Chain Trekking Passport

**Program ID:** `Hhf9G9gUrQRjJ1ZPhgrZzj3eAw8mofXtNg21WjtB2Pym` (Deployed on Devnet)

HikeToMint is a mobile-responsive web dApp that allows adventure seekers in Nepal to mint exclusive Soulbound NFTs (Non-Transferable) when they physically reach specific trekking landmarks.

## Problem Statement

Nepal attracts over 1 million trekkers annually, but achievements lack verifiable, portable proof. Traditional methods (photos, Instagram posts) are easily faked and not interoperable. **HikeToMint** solves this by creating an immutable, on-chain record of physical achievements using GPS verification + blockchain. Each trekker gets a Soulbound badge proving they actually summited—no lies, no transfers, no theft.

**Why This Matters:**
- 🥾 **Authenticity:** Proves physical presence at landmarks through GPS geolocation
- 🔒 **Non-Transferable:** Soulbound NFTs tied to individual achievements (can't be gamed or resold)
- ⛓️ **Interoperable:** Badges live on Solana—can be displayed across Web3 apps, discord roles, DAOs
- 🌍 **Global Recognition:** Achievement records accessible from anywhere

## Business Case & Impact

### Target Users
- **Trekkers & Mountaineers:** Gamify adventures with collectible badges
- **Tourism Boards:** Promote destinations through verifiable achievement programs
- **Hotels & Lodges:** Reward guests with location-based NFTs
- **Fitness Communities:** Create "coins-for-steps" loyalty programs

### Use Cases
1. **Tourism Loyalty Programs:** Nepal Tourism Board offers Soulbound badges for peak summits
2. **Corporate Wellness:** Companies issue badges to employees who complete fitness trails
3. **DAO Governance:** Badge holders unlock voting rights or exclusive DAO roles
4. **Heritage Preservation:** Archaeological sites use badges to fund conservation

### Market Opportunity
- Global hiking market: **$683B annually**
- Web3 loyalty tokens: **$50B+ addressable market**
- Solana NFT ecosystem: **10M+ active users**

## Features
- **GPS Verification:** Uses the Browser Geolocation API to verify the user is within 500m of the target landmark.
- **Soulbound NFTs:** Utilizes Solana Token Extensions (Token-2022) to ensure badges are non-transferable.
- **Adventure Theme:** A premium, modern UI designed for mountain lovers.
- **Devnet Ready:** Fully configured for Solana Devnet.

## Featured Landmarks
- **Kathmandu (Basantapur):** 27.704, 85.307 (For easy testing!)
- **Poon Hill:** 28.397, 83.684
- **Everest Base Camp:** 28.004, 86.858
- **Annapurna Base Camp:** 28.530, 83.939
- **Mint Radius:** 500 Meters

---

## Technical Stack
- **Framework:** Next.js (App Router), Tailwind CSS
- **Blockchain:** Solana (Anchor, Token-2022)
- **Wallet:** @solana/wallet-adapter-react
- **Icons:** Lucide React
- **Notifications:** React Hot Toast

---

## Getting Started

### Prerequisites
- Node.js & npm
- Solana CLI & Anchor CLI (for contract deployment)
- A Solana Wallet (e.g., Phantom) with Devnet SOL

### Smart Contract Deployment
1. Navigate to the `anchor` directory:
   ```bash
   cd anchor
   ```
2. Build the program:
   ```bash
   anchor build
   ```
3. Deploy to Devnet:
   ```bash
   anchor deploy --provider.cluster devnet
   ```

### Frontend Setup
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Implementation Details

### Soulbound NFT (lib.rs)
The Anchor program uses the `spl-token-2022` crate to initialize a mint with the `NonTransferable` extension. It also uses the `MetadataPointer` extension to link metadata directly to the mint account.

### Geolocation Logic
The `useGeolocation` hook calculates the distance between the user's current coordinates and the target landmark using the Haversine formula. The "Claim Badge" button is only enabled when the user is within the specified radius.

---

## Demo Video & Live Experience

📹 **Demo Video:** Coming soon - 3 minute demo video showing live experience
🌐 **Live Deployment:** Coming soon - Vercel/Netlify deployment URL

---

## Project Team

Built with ❤️ by the Superteam Nepal community.

**Note:** Built as part of **Superteam Nepal Solana Bounty** - Beginner-friendly mini-hack to showcase Nepali tech talent on Solana.

**Contributing:** This is an open-source project. Contributions and suggestions are welcome! Feel free to fork, submit issues, or create pull requests.

---

## Broader Implications & Future Roadmap

### Why This Matters for Solana
1. **Real-World Use Case:** Bridges physical activity + blockchain (not just trading/gaming)
2. **Token Extensions in Action:** Demonstrates practical use of Token-2022 NonTransferable extension
3. **Mobile-First:** Mobile-responsive design preps for Solana Mobile integration
4. **Emerging Market:** Location-based dApps are nascent—early mover advantage

### Future Enhancements
- ⚙️ **Solana Mobile SDK Integration:** Native Android/iOS app with GPS sensors
- 🌐 **Global Expansion:** Landmark networks worldwide (mountains, cities, heritage sites)
- 👥 **Social Features:** Leaderboards, squad badges, cooperative trekking quests
- 💰 **Monetization:** Premium landmarks, sponsored badges, marketplace for collectors
- 🤝 **Partnerships:** Integration with tourism boards, outdoor gear brands, fitness apps
- 🔐 **Compressed State:** Optimize on-chain storage for thousands of users

### Potential Impact
- **Trekking Gamification:** 1M+ annual Nepal trekkers could have verifiable achievement records
- **Tourism Growth:** Measurable data on landmark visits aids infrastructure planning
- **Loyalty Economics:** Brands save 60%+ on fraud vs. traditional reward programs
- **Web3 Onboarding:** Non-technical users enter Web3 through location-based experiences

---

## Building in Public

**Share Your Support:**
- ⭐ **Star this repo** to show support for location-based Web3!
- 🐦 **X/Twitter:** Tag with #Solana #SolanaDevs #NepalTech
- 💼 **LinkedIn:** Share your thoughts on location-based blockchain
- 🔗 **GitHub:** Fork and contribute to the project!

**Join the Movement:**
- Build the future of location-based blockchain applications
- Connect with Nepal's tech & Web3 community
- Explore Token Extensions and Solana Mobile features

---

## Deployment Instructions

### Option 1: Deploy Frontend to Vercel (Recommended)
```bash
# Install Vercel CLI
npm install -g vercel

# From frontend directory
cd frontend
vercel

# Follow prompts and grab your live URL
# Add URL to README and bounty submission
```

### Option 2: Deploy to Netlify
```bash
# Install Netlify CLI
npm install -g netlify-cli

# From frontend directory
cd frontend
netlify deploy

# Add deployment URL to README
```

### Option 3: Deploy Smart Contract to Mainnet (Optional)
⚠️ **For production only:**
```bash
cd anchor
anchor deploy --provider.cluster mainnet-beta
```

---

## Resources & Inspiration

This project explores:
- ✅ **Token Extensions:** NonTransferable NFTs via Token-2022
- ✅ **Geolocation API:** Browser-based GPS verification
- ✅ **Anchor Framework:** Rust smart contracts on Solana
- ✅ **Mobile-First UX:** Responsive design for trekkers

**Recommended Resources:**
- [Anchor Book](https://docs.anchorlang.com/)
- [Token Extensions Documentation](https://solana.com/docs/core/tokens/token-extensions)
- [Solana Mobile Stack](https://docs.solanamobile.com/)
- [Web3.js Documentation](https://solana-labs.github.io/solana-web3.js/)

---

## License

MIT License - Feel free to fork and build upon this project!
