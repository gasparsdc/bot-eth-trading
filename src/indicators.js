import { EMA, RSI } from 'technicalindicators';

const RSI_PERIOD = 14;
const EMA_SHORT_PERIOD = 20;
const EMA_LONG_PERIOD = 50;
const EMA_MACRO_PERIOD = 200; // NOUVEAU : La tendance de fond

export function calculateIndicators(priceHistory) {
    // On s'assure d'avoir au moins 200 prix en mémoire
    if (priceHistory.length < EMA_MACRO_PERIOD) {
         return null; 
    }

    const rsiResult = RSI.calculate({ values: priceHistory, period: RSI_PERIOD });
    const emaShortResult = EMA.calculate({ values: priceHistory, period: EMA_SHORT_PERIOD });
    const emaLongResult = EMA.calculate({ values: priceHistory, period: EMA_LONG_PERIOD });
    
    // NOUVEAU : Calcul de l'EMA 200
    const emaMacroResult = EMA.calculate({ values: priceHistory, period: EMA_MACRO_PERIOD });

    return {
        rsi: rsiResult[rsiResult.length - 1],
        emaShort: emaShortResult[emaShortResult.length - 1],
        emaLong: emaLongResult[emaLongResult.length - 1],
        emaMacro: emaMacroResult[emaMacroResult.length - 1]
    };
}