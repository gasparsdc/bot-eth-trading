// On initialise un faux portefeuille
export const portfolio = {
    usdcBalance: 1000, // On commence avec 1000 faux dollars
    ethBalance: 0,
    positionOpen: false,
    entryPrice: 0
};

export function executePaperTrade(action, currentPrice) {
    if (action === "ACHAT" && !portfolio.positionOpen) {
        // On achète tout en ETH
        const ethToBuy = portfolio.usdcBalance / currentPrice;
        portfolio.ethBalance = ethToBuy;
        portfolio.usdcBalance = 0;
        portfolio.positionOpen = true;
        portfolio.entryPrice = currentPrice;
        
        console.log(`🟢 [PAPER TRADE] Achat de ${ethToBuy.toFixed(4)} ETH au prix de $${currentPrice}`);
        console.log(`💼 Solde: ${portfolio.ethBalance.toFixed(4)} ETH | $0 USDC`);
    } 
    else if (action === "VENTE" && portfolio.positionOpen) {
        // On revend tout l'ETH contre de l'USDC
        const usdcToReceive = portfolio.ethBalance * currentPrice;
        
        // Calcul du Profit & Loss (PnL)
        const pnl = usdcToReceive - (portfolio.entryPrice * portfolio.ethBalance * (usdcToReceive/portfolio.ethBalance)); // Calcul simplifié
        const absolutePnl = usdcToReceive - (portfolio.entryPrice * portfolio.ethBalance);
        
        portfolio.usdcBalance = usdcToReceive;
        portfolio.ethBalance = 0;
        portfolio.positionOpen = false;
        
        console.log(`🔴 [PAPER TRADE] Vente au prix de $${currentPrice}`);
        console.log(`💼 Solde: 0 ETH | $${portfolio.usdcBalance.toFixed(2)} USDC`);
        console.log(`📊 PnL de ce trade : $${absolutePnl.toFixed(2)}`);
    }
}