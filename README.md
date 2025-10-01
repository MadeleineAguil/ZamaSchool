# ZamaSchool 🎓

<div align="center">

**An Interactive Educational Platform for Learning Zama Fully Homomorphic Encryption (FHE) Technology**

[![License: BSD-3-Clause-Clear](https://img.shields.io/badge/License-BSD--3--Clause--Clear-blue.svg)](https://opensource.org/licenses/BSD-3-Clause-Clear)
[![Node Version](https://img.shields.io/badge/node-%3E%3D20-brightgreen)](https://nodejs.org/)
[![Powered by Zama](https://img.shields.io/badge/Powered%20by-Zama-purple)](https://www.zama.ai/)

[Live Demo](#) | [Documentation](https://docs.zama.ai/fhevm) | [Report Bug](https://github.com/MadeleineAguil/ZamaSchool/issues) | [Request Feature](https://github.com/MadeleineAguil/ZamaSchool/issues)

</div>

---

## 📖 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Why ZamaSchool?](#why-zamaschool)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Problem Statement & Solution](#problem-statement--solution)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Deployment](#deployment)
- [Project Structure](#project-structure)
- [Smart Contracts](#smart-contracts)
- [Frontend Features](#frontend-features)
- [Usage Examples](#usage-examples)
- [Testing](#testing)
- [Security Considerations](#security-considerations)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Support & Community](#support--community)
- [Acknowledgments](#acknowledgments)

---

## 🌟 Overview

**ZamaSchool** is a comprehensive, hands-on educational platform designed to demystify Fully Homomorphic Encryption (FHE) technology through interactive demonstrations and practical examples. Built on Zama's FHEVM (Fully Homomorphic Encryption Virtual Machine), ZamaSchool enables developers, students, and blockchain enthusiasts to learn how to build confidential smart contracts that preserve data privacy while performing computations on encrypted data.

Unlike traditional blockchain applications where all data is publicly visible, ZamaSchool demonstrates how FHE enables **computation on encrypted data without ever decrypting it**, opening new possibilities for privacy-preserving decentralized applications (dApps).

---

## ✨ Key Features

### 🔐 **Complete FHE Lifecycle Demonstrations**

1. **SDK Installation & Setup**
   - Step-by-step guide to integrating Zama's Relayer SDK
   - Frontend configuration and initialization
   - Network setup and contract address management

2. **Encrypted Data Storage**
   - Store encrypted 32-bit integers on-chain
   - Store encrypted Ethereum addresses
   - User-specific encrypted data with access control

3. **Client-Side User Decryption**
   - Decrypt encrypted numbers using user private keys
   - Decrypt encrypted addresses with proper ACL permissions
   - Re-encryption mechanism for data privacy

4. **On-Chain Public Decryption**
   - Asynchronous decryption through Oracle
   - Callback-based decryption workflow
   - Public decryption for transparent results

5. **Encrypted Arithmetic Operations**
   - **Addition**: Add encrypted numbers without revealing values
   - **Subtraction**: Subtract encrypted operands
   - **Multiplication**: Multiply encrypted integers
   - **Division**: Divide by plaintext constants
   - **Multi-user operations**: Add numbers from different users

6. **Encrypted Comparison Operations**
   - **Equality checks** (==)
   - **Greater than** (>)
   - **Less than** (<)
   - **Greater than or equal** (>=)
   - **Less than or equal** (<=)
   - **Cross-user comparisons**: Compare encrypted data between users

### 🎓 **Educational Interface**

- **Interactive tutorials**: Step-by-step lessons with clear explanations
- **Visual feedback**: Real-time status updates and transaction confirmations
- **Error handling**: Clear error messages with troubleshooting guidance
- **Progressive complexity**: From basic encryption to advanced FHE operations

---

## 🎯 Why ZamaSchool?

### **The Privacy Problem in Blockchain**

Traditional blockchain technology suffers from a fundamental privacy paradox:
- **Transparency vs. Privacy**: All data is publicly visible on-chain
- **Limited use cases**: Sensitive data (medical records, financial information, personal data) cannot be safely stored
- **Regulatory compliance**: GDPR and privacy laws conflict with public blockchain transparency
- **Competitive disadvantage**: Business logic and sensitive algorithms are exposed

### **The FHE Solution**

Fully Homomorphic Encryption (FHE) allows computations on encrypted data:
```
Encrypted(a) + Encrypted(b) = Encrypted(a + b)
```

**Benefits:**
- ✅ **True Privacy**: Data remains encrypted on-chain and during computation
- ✅ **Verifiable Computation**: Smart contract logic can be audited without exposing data
- ✅ **Regulatory Compliance**: Sensitive data never leaves encrypted state
- ✅ **New Use Cases**: Private DeFi, confidential voting, encrypted auctions, private gaming

### **Why Learn Through ZamaSchool?**

1. **Hands-On Learning**: Interactive demos beat theoretical documentation
2. **Real-World Examples**: Practical use cases you can deploy immediately
3. **Complete Workflow**: End-to-end implementation from encryption to decryption
4. **Production-Ready Code**: All contracts and frontend code are auditable and deployable
5. **Community Support**: Open-source with active community and documentation

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend (React)                         │
│  ┌────────────────┐  ┌──────────────┐  ┌────────────────────┐  │
│  │  RainbowKit    │  │   Viem       │  │  Zama Relayer SDK  │  │
│  │  (Wallet)      │  │   (Contract  │  │  (FHE Operations)  │  │
│  │                │  │   Interaction)│  │                    │  │
│  └────────────────┘  └──────────────┘  └────────────────────┘  │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          │ RPC Calls
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Ethereum Network (Sepolia)                    │
│  ┌────────────────┐  ┌──────────────┐  ┌────────────────────┐  │
│  │ NumberStorage  │  │ AddressStorage│  │ OnchainDecryption │  │
│  │ Contract       │  │ Contract      │  │ Contract           │  │
│  └────────────────┘  └──────────────┘  └────────────────────┘  │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          │ FHE Operations
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                      FHEVM Infrastructure                        │
│  ┌────────────┐  ┌──────────┐  ┌────────┐  ┌────────────────┐  │
│  │  Executor  │  │   ACL    │  │  KMS   │  │  Relayer       │  │
│  │  Contract  │  │ Contract │  │ Network│  │  (Gateway)     │  │
│  └────────────┘  └──────────┘  └────────┘  └────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### **Component Breakdown**

#### **Frontend Layer**
- **React + Vite**: Fast, modern web application framework
- **RainbowKit + Wagmi**: Web3 wallet connection and management
- **Viem**: Type-safe Ethereum interactions
- **Zama Relayer SDK**: Client-side FHE encryption/decryption

#### **Smart Contract Layer**
- **NumberStorage**: Encrypted integer storage and arithmetic operations
- **AddressStorage**: Encrypted address storage and management
- **OnchainDecryption**: Oracle-based public decryption demonstrations

#### **FHEVM Infrastructure**
- **Executor Contract**: Handles FHE computation execution
- **ACL Contract**: Manages access control for encrypted data
- **KMS (Key Management Service)**: Threshold network for key management
- **Gateway/Relayer**: Bridges user operations to FHE network

---

## 🛠️ Technology Stack

### **Smart Contract Development**
| Technology | Version | Purpose |
|------------|---------|---------|
| **Solidity** | ^0.8.24 | Smart contract programming language |
| **Hardhat** | ^2.26.0 | Development environment and testing framework |
| **@fhevm/solidity** | ^0.8.0 | Zama's FHE Solidity library |
| **@zama-fhe/oracle-solidity** | ^0.1.0 | On-chain decryption Oracle integration |
| **TypeScript** | ^5.8.3 | Type-safe contract interaction scripts |

### **Frontend Development**
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | ^18.3.1 | UI framework |
| **Vite** | ^7.1.2 | Build tool and dev server |
| **Viem** | ^2.37.1 | Ethereum library for contract interaction |
| **Wagmi** | ^2.16.9 | React hooks for Ethereum |
| **RainbowKit** | ^2.2.8 | Wallet connection UI components |
| **@zama-fhe/relayer-sdk** | ^0.2.0 | Client-side FHE operations |

### **Development Tools**
- **Hardhat Deploy**: Automated contract deployment
- **TypeChain**: TypeScript bindings for contracts
- **ESLint + Prettier**: Code quality and formatting
- **Solhint**: Solidity linting
- **Mocha + Chai**: Testing framework

---

## 🔍 Problem Statement & Solution

### **Problems Addressed**

#### 1. **Privacy in Blockchain Applications**
**Problem**: Traditional smart contracts expose all data publicly, making them unsuitable for sensitive applications like healthcare, finance, and private voting.

**ZamaSchool Solution**: Demonstrates how to encrypt data before storing on-chain and perform computations without decryption.

#### 2. **Steep Learning Curve for FHE**
**Problem**: FHE is complex, and existing documentation often lacks practical, runnable examples.

**ZamaSchool Solution**: Provides interactive, step-by-step tutorials with working code that users can deploy and test immediately.

#### 3. **Integration Complexity**
**Problem**: Integrating FHE into existing dApps requires understanding multiple components (encryption, ACL, decryption, relayer).

**ZamaSchool Solution**: Offers complete end-to-end examples covering SDK setup, encryption, contract interaction, and both user and public decryption.

#### 4. **Limited Use Case Examples**
**Problem**: Developers struggle to envision practical applications of FHE technology.

**ZamaSchool Solution**: Demonstrates real-world scenarios:
- Private financial calculations
- Encrypted data comparison (useful for auctions, voting)
- Confidential address storage (for private token distributions)
- Cross-user encrypted operations (for collaborative computation)

### **Impact**

- **Accelerated Learning**: Reduce FHE learning curve from weeks to hours
- **Production Readiness**: Provide battle-tested code patterns for production apps
- **Ecosystem Growth**: Lower barrier to entry for FHE-enabled dApp development
- **Privacy Innovation**: Enable new privacy-preserving blockchain applications

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

```bash
# Node.js (version 20 or higher)
node --version  # Should output v20.x.x or higher

# npm (version 7 or higher)
npm --version   # Should output 7.x.x or higher

# Git
git --version
```

**Additional Requirements:**
- MetaMask or another Web3 wallet
- Sepolia testnet ETH (get from [Sepolia faucet](https://sepoliafaucet.com/))
- Infura API key (register at [infura.io](https://infura.io/))

### Installation

#### 1. **Clone the Repository**
```bash
git clone https://github.com/MadeleineAguil/ZamaSchool.git
cd ZamaSchool
```

#### 2. **Install Smart Contract Dependencies**
```bash
npm install
```

#### 3. **Install Frontend Dependencies**
```bash
cd frontend
npm install
cd ..
```

### Configuration

#### 1. **Set Up Environment Variables**

Create a `.env` file in the root directory:

```bash
# Set your mnemonic for contract deployment
npx hardhat vars set MNEMONIC
# Enter your 12-word seed phrase when prompted

# Set Infura API key for Sepolia network access
npx hardhat vars set INFURA_API_KEY
# Enter your Infura API key

# (Optional) Set Etherscan API key for contract verification
npx hardhat vars set ETHERSCAN_API_KEY
# Enter your Etherscan API key
```

#### 2. **Configure Frontend Contract Addresses**

After deploying contracts (see Deployment section), update `frontend/src/config/contracts.js`:

```javascript
export const CONTRACT_ADDRESSES = {
  NumberStorage: "0xYourNumberStorageAddress",
  AddressStorage: "0xYourAddressStorageAddress",
  OnchainDecryption: "0xYourOnchainDecryptionAddress",
  ConfidentialToken: "0xYourConfidentialTokenAddress"
};
```

### Deployment

#### **Option 1: Deploy to Local Network**

```bash
# Terminal 1: Start local FHEVM-enabled node
npx hardhat node

# Terminal 2: Deploy contracts
npx hardhat deploy --network localhost
```

#### **Option 2: Deploy to Sepolia Testnet** (Recommended)

```bash
# Compile contracts
npm run compile

# Deploy to Sepolia
npx hardhat deploy --network sepolia

# Verify contracts on Etherscan
npx hardhat verify --network sepolia <CONTRACT_ADDRESS>
```

#### **Run Frontend Application**

```bash
cd frontend
npm run dev
# Open http://localhost:5173 in your browser
```

---

## 📂 Project Structure

```
ZamaSchool/
├── contracts/                      # Smart contract source files
│   ├── NumberStorage.sol           # Encrypted number storage & operations
│   ├── AddressStorage.sol          # Encrypted address storage
│   ├── OnchainDecryption.sol       # On-chain decryption demonstrations
│   └── ConfidentialToken.sol       # Confidential ERC20-like token
│
├── deploy/                         # Deployment scripts
│   └── 01_deploy_contracts.ts      # Hardhat-deploy script
│
├── frontend/                       # React frontend application
│   ├── src/
│   │   ├── components/             # React components
│   │   │   ├── ZamaIntro.jsx       # SDK introduction
│   │   │   ├── SDKDemo.jsx         # SDK setup demo
│   │   │   ├── NumberStorage.jsx   # Number encryption UI
│   │   │   ├── NumberDecryption.jsx # User decryption UI
│   │   │   ├── AddressStorage.jsx  # Address encryption UI
│   │   │   ├── AddressDecryption.jsx # Address decryption UI
│   │   │   ├── FHECalculations.jsx  # Arithmetic operations UI
│   │   │   ├── NumberComparison.jsx # Comparison operations UI
│   │   │   ├── OnchainDecryption.jsx # Public decryption UI
│   │   │   └── ConfidentialToken.jsx # Confidential token demo
│   │   │
│   │   ├── hooks/                  # Custom React hooks
│   │   │   ├── useFHEVM.js         # FHEVM SDK initialization
│   │   │   ├── useContracts.js     # Contract interaction hooks
│   │   │   └── useEthersSigner.js  # Ethers.js signer hook
│   │   │
│   │   ├── contexts/               # React contexts
│   │   │   ├── FHEVMContext.jsx    # Global FHEVM state
│   │   │   └── I18nContext.jsx     # Internationalization context
│   │   │
│   │   ├── config/                 # Configuration files
│   │   │   └── contracts.js        # Contract addresses & ABIs
│   │   │
│   │   ├── wagmi.js                # Wagmi configuration
│   │   ├── App.jsx                 # Main application component
│   │   └── main.jsx                # Application entry point
│   │
│   └── package.json                # Frontend dependencies
│
├── test/                           # Contract test files
│   ├── NumberStorage.test.ts
│   ├── AddressStorage.test.ts
│   └── OnchainDecryption.test.ts
│
├── tasks/                          # Hardhat custom tasks
├── docs/                           # Documentation
│   ├── zama_llm.md                 # FHE contract development guide
│   └── zama_doc_relayer.md         # Relayer SDK documentation
│
├── hardhat.config.ts               # Hardhat configuration
├── package.json                    # Root dependencies
├── tsconfig.json                   # TypeScript configuration
├── CLAUDE.md                       # AI assistant instructions
└── README.md                       # This file
```

---

## 📜 Smart Contracts

### **1. NumberStorage.sol**

**Purpose**: Demonstrates encrypted integer storage and arithmetic operations.

**Key Functions**:
- `storeNumber(externalEuint32, bytes)`: Store encrypted 32-bit integer
- `addToStoredNumber(externalEuint32, bytes)`: Add to stored encrypted number
- `subtractFromStoredNumber(externalEuint32, bytes)`: Subtract from stored number
- `multiplyStoredNumber(externalEuint32, bytes)`: Multiply stored number
- `divideStoredNumber(uint32)`: Divide stored number by plaintext constant
- `addTwoStoredNumbers(address, address)`: Add encrypted numbers from two users
- `compareStoredNumberEqual/Greater/Less(externalEuint32, bytes)`: Comparison operations
- `compareTwoUsersNumbers(address, address, string)`: Compare numbers between users

**Use Cases**: Private financial calculations, encrypted counters, confidential voting tallies

### **2. AddressStorage.sol**

**Purpose**: Demonstrates encrypted Ethereum address storage.

**Key Functions**:
- `storeAddress(externalEaddress, bytes)`: Store encrypted Ethereum address
- `getStoredAddress(address)`: Retrieve encrypted address for decryption

**Use Cases**: Private token distributions, confidential whitelists, encrypted recipient lists

### **3. OnchainDecryption.sol**

**Purpose**: Demonstrates asynchronous on-chain decryption via Oracle.

**Key Functions**:
- `storeEncryptedNumber(euint32)`: Store encrypted number for public decryption
- `requestDecryptNumber()`: Request asynchronous decryption
- `callbackDecryptNumber(uint256, bytes, bytes)`: Callback for decryption results
- `getDecryptionStatus(address)`: Check decryption request status

**Use Cases**: Public auctions, lottery results, transparent encrypted computations

### **4. ConfidentialToken.sol**

**Purpose**: Demonstrates a confidential ERC20-like token with encrypted balances.

**Key Functions**:
- `mint(externalEuint64, bytes)`: Mint encrypted tokens to caller
- `transfer(address, externalEuint64, bytes)`: Transfer encrypted amount to recipient
- `balanceOf(address)`: Get encrypted balance of an account
- `totalSupply()`: Get encrypted total supply

**Use Cases**: Private token systems, confidential payments, encrypted asset transfers

---

## 🖥️ Frontend Features

### **1. Interactive Tutorial Flow**

Users progress through lessons in logical order:
```
Step 1: Introduction & SDK Overview
   ↓
Step 2: SDK Installation Demo
   ↓
Step 3: Encrypted Number Storage
   ↓
Step 4: User Decryption (Client-Side)
   ↓
Step 5: Encrypted Address Storage
   ↓
Step 6: Address Decryption
   ↓
Step 7: On-Chain Public Decryption
   ↓
Step 8: FHE Arithmetic Operations
   ↓
Step 9: FHE Comparison Operations
   ↓
Step 10: Confidential Token Demo
```

### **2. Component Highlights**

#### **ZamaIntro.jsx**
- Overview of Zama FHE technology
- Explanation of confidential smart contracts
- Use case examples

#### **SDKDemo.jsx**
- Live SDK installation demonstration
- Network configuration display
- Instance creation walkthrough

#### **NumberStorage.jsx**
- Input field for plaintext numbers
- Client-side encryption visualization
- Transaction submission and confirmation
- Real-time ciphertext handle display

#### **NumberDecryption.jsx**
- Re-encryption key generation
- EIP-712 signature workflow
- User decryption execution
- Decrypted value display with comparison

#### **FHECalculations.jsx**
- Arithmetic operation selection (add/subtract/multiply/divide)
- Two-user number addition
- Result encryption and ACL management
- Result decryption with visual feedback

#### **NumberComparison.jsx**
- Comparison operator selection (==, >, <, >=, <=)
- User-to-user encrypted comparisons
- Boolean result decryption
- Visual comparison result display

#### **OnchainDecryption.jsx**
- Public decryption request flow
- Pending status visualization
- Oracle callback monitoring
- Public decrypted result display

#### **ConfidentialToken.jsx**
- Confidential token minting
- Encrypted token transfers
- Encrypted balance viewing with decryption
- Total supply tracking
- Multi-language support (EN/中文/FR)

---

## 💡 Usage Examples

### **Example 1: Encrypted Number Storage and Addition**

```javascript
// Frontend (React component)
import { useContracts } from './hooks/useContracts';

function EncryptedCalculator() {
  const { numberStorageContract, instance } = useContracts();

  async function storeAndAddNumbers() {
    // 1. Create encrypted input
    const input1 = instance.createEncryptedInput(
      numberStorageContract.address,
      userAddress
    );
    input1.add32(42);
    const encrypted1 = await input1.encrypt();

    // 2. Store first number
    await numberStorageContract.storeNumber(
      encrypted1.handles[0],
      encrypted1.inputProof
    );

    // 3. Add second number
    const input2 = instance.createEncryptedInput(
      numberStorageContract.address,
      userAddress
    );
    input2.add32(58);
    const encrypted2 = await input2.encrypt();

    await numberStorageContract.addToStoredNumber(
      encrypted2.handles[0],
      encrypted2.inputProof
    );

    // 4. Decrypt result
    const encryptedResult = await numberStorageContract.getCalculationResult(userAddress);
    const decryptedResult = await userDecrypt(encryptedResult);

    console.log('Result:', decryptedResult); // 100 (encrypted throughout!)
  }
}
```

### **Example 2: Private Auction with Encrypted Bids**

```solidity
// Solidity contract
contract PrivateAuction {
    mapping(address => euint32) public bids;

    function placeBid(externalEuint32 encryptedBid, bytes calldata proof) external {
        euint32 bid = FHE.fromExternal(encryptedBid, proof);
        bids[msg.sender] = bid;
        FHE.allowThis(bids[msg.sender]);
        FHE.allow(bids[msg.sender], msg.sender);
    }

    function compareMyBid(address otherBidder) external view returns (ebool) {
        // Compare without revealing actual bid amounts
        return FHE.gt(bids[msg.sender], bids[otherBidder]);
    }
}
```

### **Example 3: Confidential Voting**

```solidity
contract ConfidentialVoting {
    mapping(uint256 => euint32) public proposalVotes;

    function vote(uint256 proposalId, externalEuint32 encryptedVote, bytes calldata proof) external {
        euint32 vote = FHE.fromExternal(encryptedVote, proof);
        proposalVotes[proposalId] = FHE.add(proposalVotes[proposalId], vote);
        FHE.allowThis(proposalVotes[proposalId]);
    }

    // After voting period, reveal results
    function revealResults(uint256 proposalId) external returns (uint256) {
        bytes32[] memory cts = new bytes32[](1);
        cts[0] = FHE.toBytes32(proposalVotes[proposalId]);
        return FHE.requestDecryption(cts, this.resultsCallback.selector);
    }
}
```

---

## 🧪 Testing

### **Run All Tests**
```bash
npm run test
```

### **Run Tests on Sepolia Testnet**
```bash
npm run test:sepolia
```

### **Test Coverage Report**
```bash
npm run coverage
```

### **Sample Test Output**
```
  NumberStorage
    ✓ Should store encrypted number
    ✓ Should perform addition on encrypted numbers
    ✓ Should perform subtraction
    ✓ Should compare encrypted numbers
    ✓ Should add two users' numbers

  AddressStorage
    ✓ Should store encrypted address
    ✓ Should retrieve encrypted address

  OnchainDecryption
    ✓ Should request decryption
    ✓ Should execute callback correctly
    ✓ Should handle decryption status
```

---

## 🔒 Security Considerations

### **Access Control (ACL)**
- Always use `FHE.allowThis()` for contract access to encrypted data
- Use `FHE.allow(ciphertext, address)` to grant user decryption permissions
- Use `FHE.allowTransient()` for temporary, gas-efficient permissions

### **Input Validation**
- Always validate external encrypted inputs with `FHE.fromExternal()`
- Verify input proofs to prevent malicious ciphertext injection
- Check `FHE.isInitialized()` before operating on encrypted data

### **Overflow Protection**
```solidity
// Check for overflow in encrypted additions
euint32 sum = FHE.add(a, b);
ebool hasOverflow = FHE.lt(sum, a);
sum = FHE.select(hasOverflow, FHE.asEuint32(type(uint32).max), sum);
```

### **Reorg Protection**
- For critical operations, implement timelock mechanisms
- Wait for sufficient block confirmations before granting ACL permissions

### **Best Practices**
- Never decrypt sensitive data on-chain unless absolutely necessary
- Use scalar operations when possible (e.g., `FHE.add(encrypted, 5)` instead of `FHE.add(encrypted, FHE.asEuint32(5))`)
- Minimize the number of FHE operations to reduce gas costs
- Test thoroughly on testnets before mainnet deployment

---

## 🗺️ Roadmap

### **Phase 1: Core Educational Features** ✅ (Completed)
- [x] Encrypted number storage and retrieval
- [x] User decryption (client-side)
- [x] On-chain public decryption
- [x] Encrypted address storage
- [x] FHE arithmetic operations (add, subtract, multiply, divide)
- [x] FHE comparison operations (eq, gt, lt, ge, le)
- [x] Multi-user encrypted operations
- [x] Confidential token implementation (ERC20-like with FHE)

### **Phase 2: Advanced FHE Features** 🚧 (In Progress)
- [ ] Encrypted array operations
- [ ] Conditional logic demonstrations (`FHE.select` patterns)
- [ ] Random number generation examples (`FHE.randEuint`)
- [ ] Bitwise operations (AND, OR, XOR, shifts)
- [ ] Type casting between encrypted types

### **Phase 3: Real-World Applications** 📋 (Planned)
- [ ] Private DeFi lending protocol demo
- [ ] Advanced confidential token features (allowances, approvals)
- [ ] Encrypted auction system
- [ ] Private voting DAO
- [ ] Confidential NFT metadata
- [ ] Multi-language support (English, Chinese, French)

### **Phase 4: Developer Tools** 🔮 (Future)
- [ ] Interactive code playground
- [ ] Contract template generator
- [ ] Gas optimization analyzer
- [ ] FHE operation cost calculator
- [ ] ACL permission visualizer

### **Phase 5: Ecosystem Expansion** 🌍 (Future)
- [ ] Mainnet deployment support
- [ ] Multi-chain support (L2s)
- [ ] Video tutorial series
- [ ] Live coding workshops
- [ ] Certification program

### **Phase 6: Community & Documentation** 📚 (Ongoing)
- [ ] Comprehensive API documentation
- [ ] Community contribution guidelines
- [ ] Bug bounty program
- [ ] Developer grants program
- [ ] Integration with popular dApp frameworks (Next.js, Wagmi templates)

---

## 🤝 Contributing

We welcome contributions from the community! Whether you're fixing bugs, adding new features, improving documentation, or suggesting ideas, your help is appreciated.

### **How to Contribute**

1. **Fork the Repository**
   ```bash
   git clone https://github.com/MadeleineAguil/ZamaSchool.git
   cd ZamaSchool
   ```

2. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make Your Changes**
   - Follow existing code style and conventions
   - Add tests for new features
   - Update documentation as needed

4. **Run Tests and Linting**
   ```bash
   npm run test
   npm run lint
   npm run prettier:check
   ```

5. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "Add feature: your feature description"
   ```

6. **Push to Your Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Open a Pull Request**
   - Describe your changes clearly
   - Reference any related issues
   - Wait for review and address feedback

### **Contribution Guidelines**

- **Code Quality**: Follow TypeScript/Solidity best practices
- **Testing**: Ensure all tests pass before submitting PR
- **Documentation**: Update README and inline comments
- **Commit Messages**: Use clear, descriptive commit messages
- **Issue First**: For major changes, open an issue for discussion first

### **Areas for Contribution**

- 🐛 **Bug Fixes**: Report and fix issues
- ✨ **New Features**: Add new FHE demonstrations
- 📝 **Documentation**: Improve tutorials and guides
- 🎨 **UI/UX**: Enhance frontend design and usability
- 🧪 **Testing**: Expand test coverage
- 🌐 **Translations**: Localize content for global audience

---

## 📄 License

This project is licensed under the **BSD-3-Clause-Clear License**. See the [LICENSE](LICENSE) file for full details.

**Summary**:
- ✅ Free to use, modify, and distribute
- ✅ Commercial use allowed
- ✅ Must include copyright notice and license
- ❌ No patent grant
- ❌ No warranty provided

---

## 🆘 Support & Community

### **Get Help**

- 📖 **Documentation**: [Zama FHEVM Docs](https://docs.zama.ai/fhevm)
- 💬 **Discord**: [Zama Community Discord](https://discord.gg/zama)
- 🐦 **Twitter**: [@zama_fhe](https://twitter.com/zama_fhe)
- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/MadeleineAguil/ZamaSchool/issues)
- 💡 **Feature Requests**: [GitHub Discussions](https://github.com/MadeleineAguil/ZamaSchool/discussions)

### **Community Resources**

- **Zama Blog**: [blog.zama.ai](https://www.zama.ai/blog)
- **FHEVM GitHub**: [github.com/zama-ai/fhevm](https://github.com/zama-ai/fhevm)
- **Hardhat Plugin**: [github.com/zama-ai/fhevm-hardhat-plugin](https://github.com/zama-ai/fhevm-hardhat-plugin)

### **Frequently Asked Questions**

**Q: What is the gas cost of FHE operations?**
A: FHE operations are more expensive than regular operations. For example, `FHE.add()` costs approximately 20,000-30,000 gas. Use scalar operations when possible to save gas.

**Q: Can I use this on mainnet?**
A: ZamaSchool is designed for Sepolia testnet. For mainnet deployment, review Zama's production guidelines and conduct thorough security audits.

**Q: How do I handle encrypted data in frontend?**
A: Use the `@zama-fhe/relayer-sdk` to create encrypted inputs and perform user decryption. See our frontend components for examples.

**Q: What are the security implications of FHE?**
A: FHE provides computational privacy but requires careful ACL management. Always use proper access control and validate inputs.

---

## 🙏 Acknowledgments

- **Zama Team**: For developing the groundbreaking FHEVM technology and providing excellent documentation
- **Hardhat Team**: For the robust development framework
- **RainbowKit & Wagmi**: For simplifying Web3 wallet integration
- **Viem**: For type-safe Ethereum interactions
- **Community Contributors**: Thank you to everyone who has contributed code, documentation, and feedback

---

## 📊 Project Statistics

- **Smart Contracts**: 4 production contracts (NumberStorage, AddressStorage, OnchainDecryption, ConfidentialToken)
- **Frontend Components**: 10+ interactive React components
- **FHE Operations Demonstrated**: 15+ (arithmetic, comparison, encryption, decryption, token operations)
- **Lines of Code**: ~6,000+ (contracts + frontend + tests)
- **Supported Languages**: 3 (English, Chinese, French)
- **Interactive Lessons**: 11 progressive tutorials
- **Documentation**: 4,000+ lines of detailed guides and examples

---

## 🌟 Star History

If you find ZamaSchool useful, please consider giving it a ⭐ on GitHub! Your support helps us continue improving the project and creating more educational resources for the FHE community.

---

## 📮 Contact

For inquiries, partnerships, or questions:

- **GitHub**: [MadeleineAguil](https://github.com/MadeleineAguil)
- **Project Repository**: [ZamaSchool](https://github.com/MadeleineAguil/ZamaSchool)
- **Issues**: [Report a Bug](https://github.com/MadeleineAguil/ZamaSchool/issues)

---

<div align="center">

**Built with ❤️ for the Privacy-Preserving Future of Blockchain**

**Powered by Zama | Fully Homomorphic Encryption Learning Platform**

[⬆ Back to Top](#zamaschool--)

</div>