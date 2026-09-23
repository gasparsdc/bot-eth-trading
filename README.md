# ETH Trading Bot

Bot de trading algorithmique pour Ethereum, développé en Node.js.

Le projet permet d'analyser les données de marché, de tester une stratégie de trading sur des données historiques et, en fonction de la configuration, d'exécuter des swaps sur Ethereum via Uniswap.

> **Disclaimer**
>
> Ce projet est expérimental et fourni à des fins éducatives et de recherche. Les résultats obtenus en backtest ne garantissent pas les performances futures. Le trading de crypto-actifs comporte un risque de perte en capital.

## Fonctionnalités

### Stratégie de trading

La stratégie actuelle repose sur plusieurs moyennes mobiles exponentielles :

* **EMA 20** : tendance court terme
* **EMA 50** : tendance intermédiaire
* **EMA 200** : filtre de tendance générale

Les signaux sont générés à partir du comportement des EMA 20 et 50, avec l'EMA 200 utilisée comme filtre supplémentaire.

### Gestion des positions

Le bot intègre un trailing stop afin d'ajuster le niveau de sortie d'une position en fonction de l'évolution du prix.

L'objectif est de limiter l'exposition lors d'un retournement de marché tout en permettant à une position profitable de rester ouverte tant que la tendance se poursuit.

### Vérification du slippage

Avant l'exécution d'un swap, le bot peut interroger la liquidité disponible afin d'estimer le montant reçu.

La fonction `getAmountsOut` permet notamment de vérifier que le prix estimé respecte les paramètres définis avant d'envoyer la transaction.

### Backtesting

Le projet dispose d'un moteur de backtest permettant d'exécuter la stratégie sur des données historiques.

Le backtest prend notamment en compte :

* les signaux d'entrée et de sortie ;
* le suivi des positions ;
* le trailing stop ;
* les frais de trading ;
* l'évolution du capital.

Les résultats sont destinés à comparer différents paramètres de stratégie et à identifier les éventuels problèmes avant un déploiement réel.

## Prérequis

* Node.js
* npm
* Un endpoint RPC Ethereum
* Un portefeuille Ethereum dédié au bot
* Des ETH ou tokens nécessaires aux tests

Pour le développement, il est recommandé d'utiliser un réseau de test tel que **Sepolia** avant toute utilisation sur Mainnet.

## Installation

Cloner le dépôt :

```bash
git clone https://github.com/TonPseudo/bot-eth-trading.git
cd bot-eth-trading
```

Installer les dépendances :

```bash
npm install
```

## Configuration

Créer un fichier `.env` à la racine du projet :

```env
PRIVATE_KEY=your_private_key
RPC_URL=https://sepolia.infura.io/v3/YOUR_API_KEY
```

Les variables exactes dépendent de la configuration utilisée par le projet.

### Sécurité

La clé privée ne doit jamais être commitée ou partagée.

Le fichier `.env` doit être présent dans `.gitignore` :

```gitignore
.env
node_modules/
```

Il est recommandé d'utiliser un portefeuille dédié au bot et de ne jamais y stocker des fonds qui ne sont pas nécessaires aux tests.

## Utilisation

### Backtest

Lancer le moteur de backtest :

```bash
npm run backtest
```

Cette commande exécute la stratégie sur les données historiques disponibles et affiche les résultats de la simulation.

### Démarrer le bot

```bash
npm start
```

Le bot démarre alors son processus de surveillance et peut exécuter les transactions configurées.

Avant de lancer cette commande, vérifier notamment :

* le réseau utilisé ;
* l'adresse du portefeuille ;
* la clé privée ;
* les paramètres de stratégie ;
* le slippage maximum autorisé ;
* les fonds disponibles.

### Vérifier le solde

```bash
node src/balance.js
```

Cette commande permet de consulter rapidement le solde du portefeuille connecté au réseau RPC configuré.

## Architecture

L'organisation du projet est prévue pour séparer les différentes responsabilités du bot.

```text
bot-eth-trading/
├── src/
│   ├── balance.js
│   └── ...
├── .env
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

La structure peut évoluer au fur et à mesure de l'ajout de nouvelles stratégies et fonctionnalités.

## Flux d'exécution

Le fonctionnement général est le suivant :

```text
Données de marché
       │
       ▼
Calcul des indicateurs
EMA 20 / EMA 50 / EMA 200
       │
       ▼
Génération du signal
       │
       ▼
Gestion de la position
+ Trailing Stop
       │
       ▼
Vérification du swap
+ Slippage
+ Liquidité
       │
       ▼
Exécution de la transaction
via Uniswap
```

## Backtesting

Le backtesting est utilisé pour évaluer le comportement de la stratégie sur des données historiques avant son utilisation en conditions réelles.

Les performances doivent être interprétées avec prudence. Une simulation historique ne reproduit pas nécessairement les conditions d'exécution rencontrées sur la blockchain.

Les résultats réels peuvent notamment différer en raison de :

* la volatilité ;
* du slippage ;
* des frais de gas ;
* de la liquidité disponible ;
* du délai entre le signal et l'exécution ;
* des conditions de marché ;
* d'éventuelles erreurs techniques.

## Développement

Avant toute utilisation sur Mainnet, il est recommandé de tester séparément :

1. le calcul des indicateurs ;
2. la génération des signaux ;
3. la gestion des positions ;
4. le trailing stop ;
5. le calcul du slippage ;
6. l'exécution des swaps ;
7. la gestion des erreurs et des transactions échouées.

L'utilisation d'un portefeuille et d'un environnement de test séparés du portefeuille principal est fortement recommandée.

## Roadmap

* [ ] Améliorer le moteur de backtest
* [ ] Ajouter des tests unitaires
* [ ] Ajouter plusieurs stratégies
* [ ] Améliorer la gestion des erreurs
* [ ] Ajouter un système de logs structuré
* [ ] Ajouter des notifications
* [ ] Ajouter un dashboard de suivi
* [ ] Améliorer la gestion du gas
* [ ] Ajouter davantage de contrôles avant l'exécution d'une transaction

## Licence

Le projet est actuellement distribué sous :

```text
MIT License
```

Voir le fichier `LICENSE` pour les conditions complètes.

## Contribution

Les contributions sont les bienvenues.

Pour proposer une modification :

```bash
git checkout -b feature/my-feature
```

Effectuer les modifications, puis ouvrir une Pull Request avec une description claire du changement.

## Avertissement

Ce logiciel n'est pas un service de conseil financier et ne constitue pas une recommandation d'investissement.

L'utilisateur est responsable de la configuration du bot, des clés privées utilisées et des transactions exécutées sur la blockchain.

