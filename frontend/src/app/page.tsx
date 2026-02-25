"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
const WalletMultiButton = dynamic(
  () => import("@solana/wallet-adapter-react-ui").then((mod) => mod.WalletMultiButton),
  { ssr: false }
);
import { useGeolocation } from "@/hooks/useGeolocation";
import { MapPin, Mountain, Compass, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import { AnchorProvider, Program } from "@coral-xyz/anchor";
import idl from "@/idl/hike_to_mint.json";
import { Keypair, PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddress, createAssociatedTokenAccountInstruction } from "@solana/spl-token";
const TOKEN_2022_PROGRAM_ID = new PublicKey("TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb");

// Landmarks in Nepal
const LANDMARKS = [
  { name: "Kathmandu (Basantapur)", lat: 27.704, lng: 85.307 },
  { name: "Poon Hill", lat: 28.397, lng: 83.684 },
  { name: "Everest Base Camp", lat: 28.004, lng: 86.858 },
  { name: "Annapurna Base Camp", lat: 28.530, lng: 83.939 },
];

const MINT_RADIUS_METERS = 500;

export default function Home() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const { publicKey, sendTransaction, signTransaction, signAllTransactions } = wallet;
  const [selectedLandmark, setSelectedLandmark] = useState(LANDMARKS[0]);
  const { location, distance, error, getPosition, setManualPosition } = useGeolocation(selectedLandmark);

  const [isMinting, setIsMinting] = useState(false);

  const canMint = useMemo(() => {
    return distance !== null && distance <= MINT_RADIUS_METERS;
  }, [distance]);

  const handleMint = async () => {
    if (!publicKey) {
      toast.error("Please connect your wallet first!");
      return;
    }

    setIsMinting(true);
    const toastId = toast.loading(`Minting your ${selectedLandmark.name} Badge...`);

    try {
      // Setup Anchor provider & program
      const provider = new AnchorProvider(connection, wallet as any, AnchorProvider.defaultOptions());
      const programId = new PublicKey((idl as any).address);
      const program = new Program(idl as any, programId, provider);

      // Create a new mint keypair (the program expects a mint account signer)
      const mintKeypair = Keypair.generate();

      // Rent-exempt lamports for a mint account (standard SPL mint size ~82 bytes)
      const MINT_SIZE = 82;
      const lamports = await connection.getMinimumBalanceForRentExemption(MINT_SIZE);

      // Associated token account for destination (user)
      const destinationAta = await getAssociatedTokenAddress(mintKeypair.publicKey, publicKey, false, TOKEN_2022_PROGRAM_ID);

      // Build pre-instructions: create mint account and create associated token account
      const createMintAccountIx = SystemProgram.createAccount({
        fromPubkey: publicKey,
        newAccountPubkey: mintKeypair.publicKey,
        space: MINT_SIZE,
        lamports,
        programId: TOKEN_2022_PROGRAM_ID,
      });

      const createAtaIx = createAssociatedTokenAccountInstruction(
        publicKey,
        destinationAta,
        publicKey,
        mintKeypair.publicKey,
        TOKEN_2022_PROGRAM_ID
      );

      // Call the Anchor program method with pre-instructions and the mint keypair as signer
      await program.methods
        .mintNft(selectedLandmark.name, "Hike", "https://example.com/metadata.json")
        .accounts({
          payer: publicKey,
          mint: mintKeypair.publicKey,
          destination: destinationAta,
          // include token-2022 program id to match on-chain program
          tokenProgram: TOKEN_2022_PROGRAM_ID,
          token_program: TOKEN_2022_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
          system_program: SystemProgram.programId,
          rent: SYSVAR_RENT_PUBKEY,
        })
        .signers([mintKeypair])
        .preInstructions([createMintAccountIx, createAtaIx])
        .rpc();

      toast.success(`Successfully minted! You've conquered ${selectedLandmark.name}!`, { id: toastId });
    } catch (err: any) {
      console.error(err);
      toast.error(`Minting failed: ${err?.message ?? err}`, { id: toastId });
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#020617] text-white flex flex-col items-center p-4">
      {/* Hero Section */}
      <div className="w-full max-w-2xl mt-12 mb-8 text-center space-y-4">
        <div className="inline-block p-4 bg-blue-500/10 rounded-3xl mb-4 border border-blue-500/20 backdrop-blur-sm">
          <Mountain className="w-12 h-12 text-blue-400" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-500">
          Nepal's On-Chain <span className="text-blue-500">Trekking Passport</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-lg mx-auto">
          Prove your adventure. Mint exclusive Soulbound badges by physically visiting Nepal's most iconic peaks and heritage sites.
        </p>
      </div>

      {/* Stats Card */}
      <div className="w-full max-w-md bg-[#0f172a]/80 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/5 shadow-[0_0_50px_-12px_rgba(59,130,246,0.3)] space-y-6">
        <div className="flex justify-between items-center bg-white/5 p-2 rounded-2xl pl-4">
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            <span className="font-medium text-slate-300">Solana Devnet</span>
          </div>
          <WalletMultiButton className="!bg-blue-600 hover:!bg-blue-700 !rounded-xl !h-10 !px-4 !text-sm !font-bold !transition-colors" />
        </div>

        {/* Landmark Selector */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Select Your Destination</label>
          <div className="grid grid-cols-1 gap-2">
            {LANDMARKS.map((landmark) => (
              <button
                key={landmark.name}
                onClick={() => setSelectedLandmark(landmark)}
                className={`flex items-center space-x-3 p-3 rounded-xl border transition-all ${selectedLandmark.name === landmark.name
                    ? "bg-blue-600/20 border-blue-500 text-blue-100 shadow-[0_0_20px_-8px_rgba(59,130,246,0.5)]"
                    : "bg-white/5 border-transparent text-slate-400 hover:bg-white/10"
                  }`}
              >
                <MapPin className={`w-4 h-4 ${selectedLandmark.name === landmark.name ? "text-blue-400" : "text-slate-600"}`} />
                <span className="text-sm font-semibold">{landmark.name}</span>
              </button>
            ))}
          </div>
          {/* Use current device location as a test destination */}
          <div className="pt-2 space-y-2">
            <button
              onClick={() => {
                if (!navigator.geolocation) {
                  toast.error("Geolocation is not supported by your browser");
                  return;
                }
                // Use higher-accuracy and a reasonable timeout
                navigator.geolocation.getCurrentPosition(
                  (pos) => {
                    const { latitude, longitude } = pos.coords;
                    const custom = { name: "My Location (Test)", lat: latitude, lng: longitude };
                    setSelectedLandmark(custom);
                    // trigger the geolocation hook to recalc distance for the new target
                    getPosition();
                    toast.success("Selected your current location as destination");
                  },
                  (err) => {
                    // Provide actionable messages for common error codes
                    if (err.code === 1) {
                      toast.error("Permission denied: allow location access in your browser and refresh the page.");
                    } else if (err.code === 2) {
                      toast.error("Position unavailable: try again or move to an open area.");
                    } else if (err.code === 3) {
                      toast.error("Timeout: unable to acquire position quickly. Try again.");
                    } else {
                      toast.error(`Unable to read location: ${err.message || 'Unknown error acquiring position'}`);
                    }
                  },
                  { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
                );
              }}
              className="w-full mt-2 py-3 rounded-xl bg-emerald-600/20 border border-emerald-500 text-emerald-300 hover:bg-emerald-600/25"
            >
              Use My Location (Test Mint)
            </button>

            <button
              onClick={() => {
                // Mock fallback to Kathmandu for testing without GPS
                const kathmandu = { name: "Kathmandu (Mock)", lat: 27.704, lng: 85.307 };
                setSelectedLandmark(kathmandu);
                // set manual position equal to the mocked destination so distance -> 0
                setManualPosition({ lat: kathmandu.lat, lng: kathmandu.lng });
                toast.success("Selected Kathmandu (mock) as destination for testing");
              }}
              className="w-full py-3 rounded-xl bg-sky-600/10 border border-sky-500 text-sky-300 hover:bg-sky-600/20"
            >
              Use Kathmandu (Mock)
            </button>
          </div>
        </div>

        <div className="py-8 border-y border-white/5 flex flex-col items-center space-y-4">
          {distance !== null ? (
            <>
              <div className="text-7xl font-mono font-black text-blue-400 tracking-tighter">
                {distance > 1000 ? `${(distance / 1000).toFixed(1)}k` : `${Math.round(distance)}m`}
              </div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-[0.3em]">Away from destination</p>
            </>
          ) : (
            <div className="flex flex-col items-center space-y-4 py-4">
              <div className="relative">
                <Compass className="w-20 h-20 text-slate-800" />
                <Compass className="w-20 h-20 text-blue-500/50 absolute top-0 left-0 animate-ping" />
              </div>
              <p className="text-slate-400 font-medium">Calibrating Satellites...</p>
            </div>
          )}
        </div>

        <button
          onClick={getPosition}
          className="w-full py-4 bg-slate-800 hover:bg-slate-700 rounded-2xl font-bold transition-all flex items-center justify-center space-x-2 border border-slate-700 active:scale-[0.98]"
        >
          <Compass className="w-5 h-5 text-blue-400" />
          <span>Sync Real-Time GPS</span>
        </button>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm flex items-center space-x-2">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <p>{error}</p>
          </div>
        )}

        <div className="space-y-4 pt-2">
          {canMint ? (
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center space-x-3 text-green-400 shadow-[0_0_20px_-10px_rgba(34,197,94,0.3)]">
              <ShieldCheck className="w-6 h-6 flex-shrink-0" />
              <p className="text-sm font-semibold">Verification Success! Destination Unlocked.</p>
            </div>
          ) : (
            <div className="p-4 bg-slate-900/50 border border-white/5 rounded-2xl text-slate-500 text-sm text-center font-medium italic">
              "The mountains are calling, and you must go."
              <br />
              <span className="text-[10px] uppercase tracking-widest mt-2 block not-italic font-bold">Get within 500m to mint</span>
            </div>
          )}

          <button
            disabled={!canMint || isMinting}
            onClick={handleMint}
            className={`w-full py-5 rounded-[1.5rem] font-black text-xl shadow-xl transition-all transform active:scale-95 ${canMint
                ? "bg-gradient-to-r from-blue-600 to-blue-500 hover:shadow-blue-500/25 hover:shadow-[0_0_30px_-5px] text-white"
                : "bg-slate-800/50 text-slate-600 cursor-not-allowed border border-white/5 opacity-50"
              }`}
          >
            {isMinting ? "Recording Adventure..." : "CLAIM BADGE"}
          </button>
        </div>
      </div>

      <div className="mt-12 flex items-center space-x-6">
        <div className="flex flex-col items-center">
          <span className="text-2xl font-bold">100%</span>
          <span className="text-[10px] text-slate-500 uppercase font-black">Soulbound</span>
        </div>
        <div className="w-[1px] h-8 bg-white/10" />
        <div className="flex flex-col items-center">
          <span className="text-2xl font-bold">Low</span>
          <span className="text-[10px] text-slate-500 uppercase font-black">Gas Fees</span>
        </div>
        <div className="w-[1px] h-8 bg-white/10" />
        <div className="flex flex-col items-center">
          <span className="text-2xl font-bold">Nepal</span>
          <span className="text-[10px] text-slate-500 uppercase font-black">Powered</span>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-auto py-12 text-slate-600 text-[10px] font-black tracking-[0.5em] uppercase">
        Designed for Superteam Nepal 🇳🇵
      </footer>
    </main>
  );
}

// Mock msg function for simulation
function msg(text: string) {
  console.log(`[Program Log] ${text}`);
}
