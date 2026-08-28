import { calculateIndicators } from "./indicators.js";

const FEE_RATE = 0.003; 
const TRAILING_STOP_PCT = 0.06; // On vend si le prix chute de 6% par rapport à son sommet

async function fetchHistoricalPrices() {
    console.log("📥 Téléchargement de l'historique ETH (1000 dernières heures)...");
    const response = await fetch("https://api.binance.com/api/v3/klines?symbol=ETHUSDT&interval=1h&limit=1000");
    const data = await response.json();
    return data.map(candle => parseFloat(candle[4]));
}

async function runBacktest() {
    const prices = await fetchHistoricalPrices();
    
    let usdcBalance = 1000;
    let ethBalance = 0;
    let positionOpen = false;
    let entryPrice = 0;
    
    // NOUVEAU : Variable pour suivre le plus haut prix atteint pendant un trade
    let highestPriceSinceEntry = 0; 
    
    let winningTrades = 0;
    let losingTrades = 0;
    let totalFeesPaid = 0;
    
    const priceHistoryQueue = [];
    console.log("⏱️ Simulation (EMA 200 + Trailing Stop) en cours...\n");

    for (let i = 0; i < prices.length; i++) {
        const currentPrice = prices[i];
        priceHistoryQueue.push(currentPrice);

        // NOUVEAU : On augmente la mémoire à 250 pour laisser la place à l'EMA 200
        if (priceHistoryQueue.length > 250) priceHistoryQueue.shift();

        const indicators = calculateIndicators(priceHistoryQueue);

        if (indicators) {
            // 1. Condition d'ACHAT (Filtre Macro ajouté)
            const isUptrend = currentPrice > indicators.emaMacro; // Le prix doit être au-dessus de l'EMA 200
            
            if (indicators.emaShort > indicators.emaLong && isUptrend && !positionOpen) {
                const fee = usdcBalance * FEE_RATE;
                totalFeesPaid += fee;
                
                ethBalance = (usdcBalance - fee) / currentPrice;
                usdcBalance = 0;
                positionOpen = true;
                entryPrice = currentPrice;
                highestPriceSinceEntry = currentPrice; // Initialisation du sommet
            } 
            
            // 2. Conditions de VENTE (Trailing Stop)
            else if (positionOpen) {
                // Mise à jour du sommet si le prix actuel est plus haut
                if (currentPrice > highestPriceSinceEntry) {
                    highestPriceSinceEntry = currentPrice;
                }

                // Calcul du seuil de vente dynamique
                const trailingStopPrice = highestPriceSinceEntry * (1 - TRAILING_STOP_PCT);
                const isEmaCrossDown = indicators.emaShort < indicators.emaLong;

                // On vend si on touche le Trailing Stop OU si la tendance s'inverse brutalement
                if (currentPrice <= trailingStopPrice || isEmaCrossDown) {
                    const grossUsdc = ethBalance * currentPrice;
                    const fee = grossUsdc * FEE_RATE;
                    totalFeesPaid += fee;
                    
                    usdcBalance = grossUsdc - fee;
                    ethBalance = 0;
                    positionOpen = false;
                    
                    if (currentPrice > entryPrice) {
                        winningTrades++;
                    } else {
                        losingTrades++;
                    }
                }
            }
        }
    }

    // --- RÉSULTATS ---
    let finalBalance = usdcBalance;
    if (positionOpen) {
        const grossUsdc = ethBalance * prices[prices.length - 1];
        const closingFee = grossUsdc * FEE_RATE;
        finalBalance = grossUsdc - closingFee;
        totalFeesPaid += closingFee;
    }

    const totalTrades = winningTrades + losingTrades;
    const winRate = totalTrades > 0 ? ((winningTrades / totalTrades) * 100).toFixed(2) : 0;
    const finalPnL = finalBalance - 1000;

    console.log("📊 --- RÉSULTATS DU BACKTEST V2 ---");
    console.log(`Capital final     : $${finalBalance.toFixed(2)} (${finalPnL > 0 ? '+' : ''}${(finalPnL / 10).toFixed(2)}%)`);
    console.log(`Frais payés total : $${totalFeesPaid.toFixed(2)} 💸`);
    console.log(`Total des trades  : ${totalTrades}`);
    console.log(`Taux de réussite  : ${winRate}% (${winningTrades} 🟩 | ${losingTrades} 🟥)`);
}

runBacktest();