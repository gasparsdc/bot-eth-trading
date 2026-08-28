import { getEthPrice } from "./price.js";
import { saveToHistory } from "./history.js";
import { calculateIndicators } from "./indicators.js";
import { executePaperTrade, portfolio } from "./paperTrading.js";
import { executeRealTrade } from "./trade.js"; // Ne sera plus grisé !

const INTERVALLE_MS = 10000; 
const priceHistoryQueue = []; 

async function checkMarket() {
    try {
        const currentPrice = await getEthPrice();
        priceHistoryQueue.push(currentPrice);

        // On garde 250 prix en mémoire pour pouvoir calculer l'EMA 200
        if (priceHistoryQueue.length > 250) {
            priceHistoryQueue.shift();
        }

        const displayTime = new Date().toLocaleTimeString();
        console.log(`\n[${displayTime}] 💰 Prix ETH : $${currentPrice}`);

        const indicators = calculateIndicators(priceHistoryQueue);
        let signal = "NEUTRE";

        if (indicators) {
            console.log(`📉 RSI: ${indicators.rsi.toFixed(2)} | EMA20: $${indicators.emaShort.toFixed(2)} | EMA50: $${indicators.emaLong.toFixed(2)} | EMA200: $${indicators.emaMacro.toFixed(2)}`);

            const isUptrend = currentPrice > indicators.emaMacro;

            // Logique d'achat (Avec le filtre de tendance Macro)
            if (indicators.emaShort > indicators.emaLong && isUptrend && portfolio.positionOpen === false) {
                signal = "ACHAT";
            } 
            // Logique de vente théorique
            else if (indicators.emaShort < indicators.emaLong && portfolio.positionOpen === true) {
                signal = "VENTE";
            }
        } else {
             console.log(`⏳ Collecte de données... (${priceHistoryQueue.length}/200 prix requis)`);
        }

        // --- C'EST ICI QUE LA TRANSACTION SE DÉCLENCHE ---
        if (signal === "ACHAT") {
            console.log("🟢 Signal ACHAT détecté ! Lancement de la transaction sur Sepolia...");
            
            // On lance la VRAIE transaction sur le Testnet pour 0.01 ETH
            await executeRealTrade("0.01");
            
            // On met à jour le faux portefeuille pour que la logique de stratégie suive
            executePaperTrade(signal, currentPrice);
            
        } else if (signal === "VENTE") {
            executePaperTrade(signal, currentPrice);
            // (La fonction de vente réelle sera codée dans un second temps)
        }

        saveToHistory(currentPrice, signal);

    } catch (error) {
        console.error("❌ Erreur :", error.message);
    }
}

async function main() {
    console.log("🚀 Démarrage du bot en mode LIVE (Testnet Sepolia)...");
    await checkMarket();
    setInterval(checkMarket, INTERVALLE_MS);
}

main();