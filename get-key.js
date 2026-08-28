import { ethers } from "ethers";

// Remplace ceci par tes 12 mots EXACTS
const mnemonic = "mot1 mot2 mot3 mot4 mot5 mot6 mot7 mot8 mot9 mot10 mot11 mot12";

try {
    // ethers v6 génère le wallet directement depuis la phrase
    const wallet = ethers.Wallet.fromPhrase(mnemonic);

    console.log("✅ Adresse publique :", wallet.address);
    console.log("🔑 Clé privée :", wallet.privateKey);
    console.log("\n⚠️ COPIE TA CLÉ ET SUPPRIME CE FICHIER IMMÉDIATEMENT ⚠️");
} catch (error) {
    console.error("Erreur, vérifie l'orthographe de tes 12 mots :", error.message);
}
