// 合约配置
export const CONTRACTS = {
  // 本地开发环境
  hardhat: {
    chainId: 31337,
    NumberStorage: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    AddressStorage: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'
  },

  // Sepolia测试网
  sepolia: {
    chainId: 11155111,
    NumberStorage: '0xb6Ffd1CB3ADBf515A4e562F4fE8c8B286C03D033',
    AddressStorage: '0x85B9c11E98c6b550b4483158E1AbF53482E18322',
    OnchainDecryption: '0xB19aAAb3c5f95FAbfb3A4cD1BB2b44Ed42356A13'
  }
}

// 获取当前网络的合约地址
export const getContractAddress = (contractName, chainId = 31337) => {
  const network = chainId === 11155111 ? 'sepolia' : 'hardhat'
  return CONTRACTS[network][contractName]
}

// 获取当前网络配置
export const getNetworkConfig = (chainId = 31337) => {
  return chainId === 11155111 ? CONTRACTS.sepolia : CONTRACTS.hardhat
}