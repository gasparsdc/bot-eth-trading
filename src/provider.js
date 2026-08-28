import { ethers } from "ethers";
import { config } from "./config.js";

// Création de la connexion au réseau Ethereum Mainnet via Infura [cite: 235, 236]
export const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);

// Initialisation du wallet : combine ta clé privée et le provider pour pouvoir signer des transactions [cite: 101, 484, 485]
export const wallet = new ethers.Wallet(config.privateKey, provider);
