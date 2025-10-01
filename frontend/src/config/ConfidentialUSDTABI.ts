// ABI aligned with artifacts/contracts/ConfidentialUSDT.sol/ConfidentialUSDT.json
const abi = [
  { inputs: [], name: 'faucet', outputs: [], stateMutability: 'nonpayable', type: 'function' },
  { inputs: [], name: 'decimals', outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }], stateMutability: 'view', type: 'function' },
  { inputs: [{ internalType: 'address', name: 'account', type: 'address' }], name: 'confidentialBalanceOf', outputs: [{ internalType: 'euint64', name: '', type: 'bytes32' }], stateMutability: 'view', type: 'function' },
  { inputs: [{ internalType: 'address', name: 'to', type: 'address' }, { internalType: 'externalEuint64', name: 'encryptedAmount', type: 'bytes32' }, { internalType: 'bytes', name: 'inputProof', type: 'bytes' }], name: 'confidentialTransfer', outputs: [{ internalType: 'euint64', name: '', type: 'bytes32' }], stateMutability: 'nonpayable', type: 'function' },
]

export default abi as const
