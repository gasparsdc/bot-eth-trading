# 📈 Bot ETH Trading Quantitatif

Bot de trading automatisé pour **Ethereum (ETH)**, développé en **Node.js**.

Le projet repose sur une architecture modulaire permettant :

* d'analyser les prix en temps réel ;
* de tester des stratégies quantitatives sur des données historiques ;
* de simuler les performances via un moteur de backtest ;
* d'exécuter des transactions sur la blockchain via les smart contracts d'Uniswap ;
* d'intégrer des mécanismes de gestion du risque et de protection contre le slippage.

> ⚠️ **Avertissement :** ce projet est expérimental et ne constitue pas un conseil financier. Le trading de cryptomonnaies comporte un risque important de perte en capital. Testez toujours le bot sur un environnement de test (comme Sepolia) avant toute utilisation sur Mainnet.

---

## 🚀 Fonctionnalités

### 📊 Analyse de tendance

La stratégie utilise plusieurs moyennes mobiles exponentielles (**EMA**) afin d'identifier la tendance du marché :

* **EMA 20** : tendance court terme ;
* **EMA 50** : tendance intermédiaire ;
* **EMA 200** : filtre de tendance macro.

Les signaux sont notamment basés sur le croisement des **EMA 20 et EMA 50**, avec confirmation par l'**EMA 200** afin de limiter les prises de position contre la tendance générale.

---

### 🛡️ Gestion du risque

Le bot intègre un **Trailing Stop dynamique** (*stop-suiveur*).

Son objectif est de :

* protéger une partie des gains accumulés ;
* limiter les pertes lorsque le marché se retourne ;
* laisser davantage courir une position lorsque la tendance reste favorable.

---

### ⛓️ Protection Blockchain & Slippage

Avant d'exécuter une transaction, le bot peut simuler le résultat attendu de l'échange grâce à `getAmountsOut`.

Cela permet notamment de vérifier :

* le montant estimé reçu ;
* la liquidité disponible ;
* l'impact potentiel du slippage ;
* si les conditions d'exécution respectent les paramètres définis par la stratégie.

Si les conditions ne sont pas satisfaisantes, la transaction peut être bloquée avant son envoi sur la blockchain.

---

### 🧪 Moteur de Backtest

Le projet comprend un moteur de **backtest** permettant de tester la stratégie sur des données historiques.

Le backtest prend notamment en compte :

* les signaux d'achat et de vente ;
* le capital initial ;
* les performances des positions ;
* le Trailing Stop ;
* les frais de trading ;
* l'évolution du portefeuille au fil du temps.

L'objectif est d'évaluer les performances théoriques de la stratégie avant de l'utiliser en conditions réelles.

---

## 🛠️ Prérequis

Avant d'installer le projet, assure-toi de disposer de :

* **Node.js** installé sur ta machine ;
* **npm** ;
* un accès à un **nœud RPC Ethereum**, par exemple via Infura ;
* un portefeuille compatible Ethereum ;
* des fonds sur le réseau utilisé.

Pour les premiers tests, il est fortement recommandé d'utiliser **Sepolia** plutôt que le Mainnet.

---

## 📦 Installation

Clone le repository :

```bash
git clone https://github.com/TonPseudo/bot-eth-trading.git
```

Place-toi dans le dossier du projet :

```bash
cd bot-eth-trading
```

Installe les dépendances :

```bash
npm install
```

---

## 🔐 Configuration

Crée un fichier `.env` à la racine du projet :

```bash
touch .env
```

Ajoute ensuite les variables nécessaires :

```env
PRIVATE_KEY=ta_cle_privee
RPC_URL=https://sepolia.infura.io/v3/TON_API_KEY
```

### ⚠️ Sécurité

**Ne partage jamais ta clé privée.**

Le fichier `.env` doit impérativement être exclu de Git.

Vérifie que ton `.gitignore` contient :

```gitignore
.env
node_modules/
```

> 💡 Pour les tests, utilise de préférence un portefeuille dédié contenant uniquement les fonds nécessaires à l'expérimentation.

---

## 🕹️ Commandes

### 🧪 Lancer un backtest

```bash
npm run backtest
```

Cette commande lance la simulation de la stratégie sur les données historiques disponibles.

Elle permet notamment d'auditer les performances théoriques de la stratégie en tenant compte des frais.

---

### 🤖 Démarrer le bot

```bash
npm start
```

Cette commande démarre le bot en mode direct.

Le bot surveille alors le marché en temps réel et peut exécuter les transactions conformément aux paramètres configurés.

> ⚠️ Vérifie impérativement le réseau, le portefeuille et les paramètres de trading avant de lancer le bot en mode réel.

---

### 💰 Vérifier le solde

```bash
node src/balance.js
```

Cette commande permet de vérifier rapidement l'état des fonds du portefeuille directement depuis la blockchain.

---

## 📁 Structure du projet

Une structure typique peut être organisée comme ceci :

```text
bot-eth-trading/
├── src/
│   ├── balance.js
│   ├── ...
│   └── ...
├── .env
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

> La structure exacte peut évoluer en fonction des différents modules ajoutés au projet.

---

## 🔄 Fonctionnement général

Le fonctionnement du bot peut être résumé ainsi :

```text
              ┌─────────────────────┐
              │   Données de marché │
              └──────────┬──────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │ Analyse des EMA     │
              │ EMA 20 / 50 / 200   │
              └──────────┬──────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │ Génération du signal│
              └──────────┬──────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │ Gestion du risque   │
              │ + Trailing Stop     │
              └──────────┬──────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │ Vérification        │
              │ liquidité / slippage│
              └──────────┬──────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │ Exécution Uniswap   │
              └─────────────────────┘
```

---

## 🧪 Environnement recommandé

Pour réduire les risques pendant le développement :

1. Développer et tester localement.
2. Effectuer les premiers tests sur **Sepolia**.
3. Vérifier les résultats du backtest.
4. Tester les mécanismes de gestion du risque.
5. Vérifier les paramètres de slippage.
6. Utiliser un portefeuille dédié avant toute utilisation sur Mainnet.

---

## ⚠️ Risques et limites

Même une stratégie rentable en backtest peut subir des pertes en conditions réelles.

Les résultats peuvent notamment être affectés par :

* la volatilité du marché ;
* le slippage réel ;
* les frais de réseau (*gas fees*) ;
* la liquidité disponible ;
* les délais d'exécution ;
* les mouvements rapides du marché ;
* les erreurs de configuration ;
* les défaillances techniques ou réseau.

Un backtest représente une simulation historique et **ne garantit pas les performances futures**.

---

## 📌 Roadmap

Quelques améliorations possibles :

* [ ] Ajouter davantage d'indicateurs techniques.
* [ ] Améliorer la gestion du risque.
* [ ] Ajouter plusieurs stratégies de trading.
* [ ] Ajouter un système de logs avancé.
* [ ] Ajouter des alertes Telegram/Discord.
* [ ] Ajouter un dashboard de suivi.
* [ ] Améliorer le moteur de backtest.
* [ ] Ajouter des tests unitaires.
* [ ] Ajouter une gestion plus avancée du gas.
* [ ] Ajouter des mécanismes de sécurité supplémentaires avant l'exécution des transactions.

---

## 📄 Licence

Ajoute ici la licence de ton choix, par exemple :

```text
MIT License
```

---

## 🤝 Contribution

Les contributions, idées et améliorations sont les bienvenues.

Pour contribuer :

```bash
git clone https://github.com/TonPseudo/bot-eth-trading.git
cd bot-eth-trading
npm install
```

Crée ensuite une branche dédiée à tes modifications, puis ouvre une Pull Request.

---

## ⭐ À propos

**Bot ETH Trading Quantitatif** est un projet expérimental destiné à explorer l'automatisation du trading algorithmique sur Ethereum, l'analyse quantitative et l'interaction avec les smart contracts décentralisés.

**Technologies principales :**

* Node.js
* Ethereum
* Uniswap
* Smart Contracts
* Analyse technique
* Backtesting
* Trading algorithmique
