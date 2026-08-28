import { ethers } from "ethers";
import { provider, wallet } from "./provider.js";

// L'adresse du jeton que tu essaies d'acheter sur Sepolia
const TOKEN_ADDRESS = "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984"; 
const erc20ABI = [
    "function balanceOf(address account) external view returns (uint256)"
];

async function checkBalances() {
    console.log(`🔍 Vérification des soldes sur Sepolia pour :`);
    console.log(`🔗 ${wallet.address}\n`);

    try {
        // 1. Lire le solde en ETH (interrogation directe du Provider)
        const ethBalanceWei = await provider.getBalance(wallet.address);
        const ethBalance = ethers.formatEther(ethBalanceWei);
        
        console.log(`🔹 ETH disponible : ${ethBalance} ETH`);

        // 2. Lire le solde en Jetons (interrogation du Smart Contract)
        const tokenContract = new ethers.Contract(TOKEN_ADDRESS, erc20ABI, provider);
        const tokenBalanceWei = await tokenContract.balanceOf(wallet.address);
        const tokenBalance = ethers.formatUnits(tokenBalanceWei, 18); // 18 décimales standard
        
        console.log(`🔸 Jetons disponibles : ${tokenBalance} Jetons`);
        console.log(`\n🏁 Fin de la vérification.`);

    } catch (error) {
        console.error("❌ Erreur de lecture :", error.message);
    }
}

checkBalances();