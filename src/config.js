import dotenv from "dotenv";
dotenv.config(); // Charge les variables du fichier .env [cite: 232]

// Vérification de sécurité : on empêche le bot de démarrer s'il manque une clé
if (!process.env.INFURA_PROJECT_ID || !process.env.PRIVATE_KEY) {
    console.error("❌ ERREUR: Variables d'environnement manquantes dans le .env");
    process.exit(1);
}

export const config = {
    infuraId: process.env.INFURA_PROJECT_ID,
    privateKey: process.env.PRIVATE_KEY
};
