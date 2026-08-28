import { ethers } from "ethers";
import { wallet } from "./provider.js";

// Adresses sur Sepolia (Testnet)
const UNISWAP_V2_ROUTER = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"; 
const WETH_ADDRESS = "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14"; 
const TOKEN_ADDRESS = "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984"; // Jeton UNI sur Sepolia

// ABI du Routeur Uniswap (CORRIGÉ : la fonction getAmountsOut est bien là)
const routerABI = [
    "function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)",
    "function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)",
    "function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)"
];

// ABI standard ERC-20 (Pour lire son solde et autoriser la vente)
const erc20ABI = [
    "function approve(address spender, uint256 amount) external returns (bool)",
    "function balanceOf(address account) external view returns (uint256)"
];

const uniswap = new ethers.Contract(UNISWAP_V2_ROUTER, routerABI, wallet);
const tokenContract = new ethers.Contract(TOKEN_ADDRESS, erc20ABI, wallet);

// --- FONCTION D'ACHAT SÉCURISÉE ---
export async function executeRealTrade(amountEthToSpend) {
    console.log(`\n⚙️ ACHAT : Préparation de la transaction (${amountEthToSpend} ETH)...`);
    try {
        const path = [WETH_ADDRESS, TOKEN_ADDRESS];
        const deadline = Math.floor(Date.now() / 1000) + 60 * 10; 
        const amountInWei = ethers.parseEther(amountEthToSpend.toString());

        // 1. Interroger Uniswap pour savoir combien on va recevoir
        console.log("🔍 Estimation du prix sur Uniswap...");
        const amounts = await uniswap.getAmountsOut(amountInWei, path);
        const expectedTokens = amounts[1]; // amounts[0] c'est l'ETH, amounts[1] c'est le Token
        
        // 2. Calculer le minimum acceptable (Tolérance de 2% de slippage)
        const amountOutMin = (expectedTokens * 98n) / 100n;
        
        console.log(`📊 Attente: ${ethers.formatUnits(expectedTokens, 18)} jetons.`);
        console.log(`🛡️ Minimum accepté (Slippage 2%) : ${ethers.formatUnits(amountOutMin, 18)} jetons.`);

        // 3. Lancer la transaction avec la protection activée
        const tx = await uniswap.swapExactETHForTokens(
            amountOutMin, // Le bouclier est actif !
            path, 
            wallet.address, 
            deadline, 
            { value: amountInWei }
        );

        console.log(`⏳ Transaction d'achat envoyée ! Hash : ${tx.hash}`);
        await tx.wait();
        console.log(`✅ Achat confirmé !`);
    } catch (error) {
        console.error("❌ Échec de l'achat (Probablement bloqué par le Slippage) :", error.message);
    }
}

// --- FONCTION DE VENTE ---
export async function executeRealSell() {
    console.log(`\n⚙️ VENTE : Vérification du portefeuille...`);
    try {
        const balance = await tokenContract.balanceOf(wallet.address);
        
        if (balance === 0n) {
            console.log("⚠️ Aucun token à vendre.");
            return;
        }
        console.log(`💰 Solde trouvé. Préparation de la revente...`);

        console.log("🔓 Autorisation d'Uniswap (Approve)...");
        const approveTx = await tokenContract.approve(UNISWAP_V2_ROUTER, balance);
        await approveTx.wait();
        console.log("✅ Autorisation validée.");

        const path = [TOKEN_ADDRESS, WETH_ADDRESS];
        const deadline = Math.floor(Date.now() / 1000) + 60 * 10;

        console.log("🚀 Envoi de la transaction de vente...");
        const swapTx = await uniswap.swapExactTokensForETH(
            balance, 
            0,       
            path,
            wallet.address,
            deadline
        );

        console.log(`⏳ Transaction de vente envoyée ! Hash : ${swapTx.hash}`);
        await swapTx.wait();
        console.log(`✅ Vente confirmée ! Les ETH sont de retour.`);

    } catch (error) {
        console.error("❌ Échec de la vente :", error.message);
    }
}