import { executeRealSell } from "./trade.js";

async function runSellTest() {
    console.log("🧪 Lancement du test de VENTE sur Sepolia...");
    await executeRealSell();
    console.log("🏁 Fin du test.");
}

runSellTest();