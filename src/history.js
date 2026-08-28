import fs from "fs";
import path from "path";

// On place le fichier CSV à la racine du projet
const filePath = path.join(process.cwd(), "history.csv");

// Initialisation : si le fichier n'existe pas, on le crée avec les colonnes
if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, "timestamp,price,signal\n");
    console.log("📄 Fichier history.csv créé avec succès.");
}

// Fonction pour ajouter une ligne de données
export function saveToHistory(price, signal) {
    try {
        // toISOString() génère une date standard (ex: 2026-07-08T20:36:29.000Z)
        // C'est le meilleur format pour exploiter les données informatiquement plus tard.
        const timestamp = new Date().toISOString(); 
        const row = `${timestamp},${price},${signal}\n`;
        
        fs.appendFileSync(filePath, row);
    } catch (error) {
        console.error("❌ Erreur lors de l'écriture dans l'historique :", error.message);
    }
}
