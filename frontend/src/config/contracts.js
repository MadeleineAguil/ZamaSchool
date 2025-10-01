// Contract configuration
export const CONTRACTS = {
  // Local development
  hardhat: {
    chainId: 31337,
    NumberStorage: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    AddressStorage: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
    OnchainDecryption: '0x...' // fill after local deployment
  },

  // Sepolia testnet
  sepolia: {
    chainId: 11155111,
    NumberStorage: '0xdc3F93D07048fD6F00Adc6ca7082203897D48eb9',
    AddressStorage: '0x624A7932b9A649A96d2e236Da2F98f77550ee597',
    OnchainDecryption: '0xfCd522fb5D78C55c99a2f1eAC8d68Bc211d8B896'
  }
}

// Get contract address by current network
export const getContractAddress = (contractName, chainId = 31337) => {
  const network = chainId === 11155111 ? 'sepolia' : 'hardhat'
  return CONTRACTS[network][contractName]
}

// Get current network config
export const getNetworkConfig = (chainId = 31337) => {
  return chainId === 11155111 ? CONTRACTS.sepolia : CONTRACTS.hardhat
}
