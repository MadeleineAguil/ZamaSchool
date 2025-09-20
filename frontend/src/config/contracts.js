// 合约配置
export const CONTRACTS = {
  // 本地开发环境
  hardhat: {
    chainId: 31337,
    NumberStorage: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    AddressStorage: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
    OnchainDecryption: '0x...' // 本地部署后填写
  },

  // Sepolia测试网
  sepolia: {
    chainId: 11155111,
    NumberStorage: '0xaa2860ECce337D7a823bBe42E1e1E135297A876d',
    AddressStorage: '0x547c23dAb2a07B4b8a268c8790338B5d8Db86A3d',
    OnchainDecryption: '0x6398469769A329f8A4DB96995f5A66272ccFA489'
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