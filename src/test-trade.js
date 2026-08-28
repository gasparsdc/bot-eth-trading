import { executeRealTrade } from "./trade.js";

async function runTest() {
    console.log("🧪 Lancement du test de transaction express sur Sepolia...");
    
    // On utilise un tout petit montant (0.001 ETH) pour économiser tes 0.05 ETH
    await executeRealTrade("0.001");
    
    console.log("🏁 Fin de la tentative de transaction.");
}

runTest();