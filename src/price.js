import { ethers } from "ethers";
import { provider } from "./provider.js";

// Adresse du contrat Chainlink pour le prix ETH/USD sur le Mainnet Ethereum
const CHAINLINK_ETH_USD_ADDRESS = "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419";

// L'ABI (Application Binary Interface) : c'est le "mode d'emploi" du contrat.
// On ne prend que la fonction dont on a besoin : latestRoundData
const aggregatorV3InterfaceABI = [
  "function latestRoundData() external view returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound)"
];

// Création d'une instance du smart contract pour interagir avec lui
const priceFeed = new ethers.Contract(CHAINLINK_ETH_USD_ADDRESS, aggregatorV3InterfaceABI, provider);

export async function getEthPrice() {
    try {
        // On interroge le contrat Chainlink (lecture seule, donc gratuit)
        const roundData = await priceFeed.latestRoundData();
        
        // Chainlink renvoie le prix avec 8 décimales.
        // ethers.formatUnits permet de convertir ce grand nombre en un nombre lisible.
        const price = Number(ethers.formatUnits(roundData.answer, 8));
        return price;
    } catch (error) {
        console.error("❌ Erreur lors de la récupération du prix :", error);
    }
}
