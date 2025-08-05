# 🌟 Simple Reputation System
# Contract Andress: ST48Z0HEKRDGKPS5R72NP5JGH29RSWH5NT1DJ0Z4.reputation-system
## 📋 Project Description

Simple Reputation System allows users to rate and build reputation on the blockchain. This is a simple but effective smart contract to track and manage users' reputation scores.

## ✨ Key Features

### 🎯 Core Features
- **Rate Users**: Rate other users (1-5 stars)
- **View Reputation**: View anyone's reputation
- **Reputation History**: Review history
- **Anti-Spam**: Each person can only rate 1 person once

### 🔧 Smart Contract Functions
- `rate-user`: Rate users
- `get-reputation`: View reputation
- `get-rating-count`: Number of reviews
- `has-rated`: Check if a rating has been given
- `get-user-ratings`: User rating history

## 🏗️ Project Structure

```
simple_reputation_system/
├── contracts/
│ └── reputation-system.clar
├── tests/
│ └── reputation-system_test.ts
├── scripts/
│ └── deploy.ts
├── interact-testnet.ts
├── Clarinet.toml
├── package.json
└── README.md
```

## 🚀 Quick Start

### 1. Setup
```bash
cd project15_simple_reputation_system
npm install
```

### 2. Test Contract
```bash
clarinet test
```

### 3. Deploy to Testnet
```bash
npm run deploy
```

### 4. Interact with Contract
```bash
npm run interact
```

## 📊 Contract Details

### Data Structures
- **User Reputation**: Total score and number of reviews
- **Ratings Map**: Who rated who and the score
- **Rating History**: History of all reviews

### Key Functions
1. **rate-user(target, rating)**: Rate user (1-5)
2. **get-reputation(user)**: Get average reputation score
3. **get-rating-count(user)**: Number of reviews received
4. **has-rated(rater, target)**: Check if rated yet

## 🎮 Demo Scenario

1. **Alice rates Bob**: 5 stars
2. **Charlie rates Bob**: 4 stars
3. **Bob's reputation**: 4.5/5 (2 ratings)
4. **Alice tries to rate Bob again**: Rejected (anti-spam)

## 🔒 Security Features

- **One Rating Per Pair**: Each person can only rate once for 1 person
- **Valid Rating Range**: Only accept 1-5 stars
- **Self-Rating Prevention**: Cannot rate yourself

## 📈 Use Cases

- **Marketplace**: Seller/buyer rating
- **Service Platform**: Rate service providers
- **Community**: Build reputation in the community
- **Gaming**: Player reputation system

## 🛠️ Tech Stack

- **Smart Contract**: Clarity
- **Testing**: TypeScript + Clarinet
- **Deployment**: Stacks Testnet
- **Interaction**: @stacks/transactions

## 📝 Contract Address

Deployed on Stacks Testnet:
```
Contract: ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.reputation-system
```

## 🎯 Future Enhancements

- **Weighted Ratings**: People with high reputation have higher vote weight
- **Categories**: Ratings by category
- **Reputation Decay**: Reputation points decrease over time
- **Incentives**: Rewards for accurate ratings

---

**Simple, Effective, Decentralized Reputation! 🌟**
