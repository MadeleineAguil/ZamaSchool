# ZamaSchool 合约部署指南

## 部署前准备

### 1. 配置环境变量

复制 `.env.example` 文件到 `.env`:
```bash
cp .env.example .env
```

在 `.env` 文件中填入以下配置:

```env
# 你的私钥（不要包含0x前缀）
PRIVATE_KEY=your_private_key_here

# Infura API Key (从 https://infura.io 获取)
INFURA_API_KEY=your_infura_api_key

# Etherscan API Key (从 https://etherscan.io/apis 获取，用于合约验证)
ETHERSCAN_API_KEY=your_etherscan_api_key

# 可选：启用gas报告
REPORT_GAS=false
```

### 2. 获取测试币

确保你的账户在Sepolia测试网有足够的ETH：
- 访问 [Sepolia Faucet](https://sepoliafaucet.com/)
- 或使用 [Alchemy Faucet](https://sepoliafaucet.com/)
- 建议至少有 0.05 ETH 进行部署

### 3. 编译合约

```bash
npm run compile
```

## 部署到Sepolia测试网

### 方法1: 使用Scripts部署 (推荐)

```bash
npm run deploy:sepolia
```

### 方法2: 使用Hardhat Deploy

```bash
npm run deploy:sepolia-hardhat
```

### 方法3: 手动部署

```bash
npx hardhat run scripts/deploy-sepolia.ts --network sepolia
```

## 部署后操作

### 1. 验证合约 (可选)

部署完成后，可以验证合约源码:

```bash
# 验证 NumberStorage 合约
npx hardhat verify --network sepolia <NumberStorage_ADDRESS>

# 验证 AddressStorage 合约
npx hardhat verify --network sepolia <AddressStorage_ADDRESS>
```

### 2. 检查部署结果

部署成功后：
- 合约地址将自动更新到 `frontend/src/config/contracts.js`
- 部署详情保存在 `frontend/src/config/deployedContracts.json`
- 在控制台查看Etherscan链接

### 3. 前端配置

前端会自动使用新部署的合约地址。确保：
- 在MetaMask中连接到Sepolia测试网
- 前端应用会自动检测网络并使用对应的合约地址

## 故障排除

### 常见错误

1. **"insufficient funds for gas * price + value"**
   - 解决：确保账户有足够的Sepolia ETH

2. **"Invalid API Key"**
   - 解决：检查 `.env` 文件中的 `INFURA_API_KEY` 是否正确

3. **"private key length is invalid"**
   - 解决：确保私钥不包含 `0x` 前缀

4. **"network sepolia is not defined"**
   - 解决：检查 `hardhat.config.ts` 配置是否正确

### 检查部署状态

```bash
# 检查账户余额
npx hardhat run scripts/check-balance.ts --network sepolia

# 测试网络连接
npx hardhat run scripts/test-connection.ts --network sepolia
```

## 部署的合约功能

### NumberStorage 合约
- 存储加密数字
- 数字加减乘除运算
- 用户数据解密

### AddressStorage 合约
- 存储加密地址
- 随机地址生成
- 地址比较功能

## 安全提醒

⚠️ **重要安全提示：**
- 永远不要将私钥提交到Git仓库
- 使用测试网专用的账户，不要使用主网账户
- `.env` 文件已加入 `.gitignore`，确保不会被提交
- 部署到主网前请充分测试

## 网络信息

### Sepolia 测试网
- **Chain ID**: 11155111
- **RPC URL**: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`
- **Block Explorer**: https://sepolia.etherscan.io
- **Currency**: SepoliaETH (测试币)

## 下一步

部署完成后，你可以：
1. 在前端测试所有功能
2. 体验加密数据的存储和解密
3. 练习FHE计算操作
4. 探索Zama的隐私保护特性