# 🌟 Simple Reputation System

## 📋 Mô Tả Project

Hệ thống đánh giá uy tín đơn giản cho phép người dùng đánh giá và xây dựng uy tín trên blockchain. Đây là một smart contract đơn giản nhưng hiệu quả để theo dõi và quản lý điểm uy tín của người dùng.

## ✨ Tính Năng Chính

### 🎯 Core Features
- **Rate Users**: Đánh giá người dùng khác (1-5 sao)
- **View Reputation**: Xem điểm uy tín của bất kỳ ai
- **Reputation History**: Lịch sử đánh giá
- **Anti-Spam**: Mỗi người chỉ đánh giá 1 lần cho 1 người

### 🔧 Smart Contract Functions
- `rate-user`: Đánh giá người dùng
- `get-reputation`: Xem điểm uy tín
- `get-rating-count`: Số lượng đánh giá
- `has-rated`: Kiểm tra đã đánh giá chưa
- `get-user-ratings`: Lịch sử đánh giá của user

## 🏗️ Cấu Trúc Project

```
project15_simple_reputation_system/
├── contracts/
│   └── reputation-system.clar
├── tests/
│   └── reputation-system_test.ts
├── scripts/
│   └── deploy.ts
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
- **User Reputation**: Tổng điểm và số lượng đánh giá
- **Ratings Map**: Ai đánh giá ai và điểm số
- **Rating History**: Lịch sử tất cả đánh giá

### Key Functions
1. **rate-user(target, rating)**: Đánh giá user (1-5)
2. **get-reputation(user)**: Lấy điểm uy tín trung bình
3. **get-rating-count(user)**: Số lượng đánh giá nhận được
4. **has-rated(rater, target)**: Kiểm tra đã rate chưa

## 🎮 Demo Scenario

1. **Alice rates Bob**: 5 sao
2. **Charlie rates Bob**: 4 sao  
3. **Bob's reputation**: 4.5/5 (2 ratings)
4. **Alice tries to rate Bob again**: Bị từ chối (anti-spam)

## 🔒 Security Features

- **One Rating Per Pair**: Mỗi người chỉ rate 1 lần cho 1 người
- **Valid Rating Range**: Chỉ chấp nhận 1-5 sao
- **Self-Rating Prevention**: Không thể tự đánh giá mình

## 📈 Use Cases

- **Marketplace**: Đánh giá seller/buyer
- **Service Platform**: Rate service providers
- **Community**: Xây dựng uy tín trong cộng đồng
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

- **Weighted Ratings**: Người có uy tín cao có vote weight lớn hơn
- **Categories**: Đánh giá theo từng lĩnh vực
- **Reputation Decay**: Điểm uy tín giảm theo thời gian
- **Incentives**: Reward cho việc đánh giá chính xác

---

**Simple, Effective, Decentralized Reputation! 🌟**
