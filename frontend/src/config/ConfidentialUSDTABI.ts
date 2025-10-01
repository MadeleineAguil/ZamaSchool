// Minimal ABI for ConfidentialUSDT interactions used in frontend
// Note: Update after deployment if actual ABI differs
const abi = [
  // faucet()
  {
    inputs: [],
    name: 'faucet',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  // balanceOf(address) returns (euint64)
  {
    inputs: [{ internalType: 'address', name: 'user', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ internalType: 'euint64', name: '', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
  },
  // transfer using encrypted amount (common patterns)
  // try variant A: transferEncrypted(externalEuint64, bytes, address)
  {
    inputs: [
      { internalType: 'externalEuint64', name: 'amount', type: 'bytes32' },
      { internalType: 'bytes', name: 'inputProof', type: 'bytes' },
      { internalType: 'address', name: 'to', type: 'address' },
    ],
    name: 'transferEncrypted',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  // variant B: transfer(externalEuint64, bytes, address)
  {
    inputs: [
      { internalType: 'externalEuint64', name: 'amount', type: 'bytes32' },
      { internalType: 'bytes', name: 'inputProof', type: 'bytes' },
      { internalType: 'address', name: 'to', type: 'address' },
    ],
    name: 'transfer',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
]

export default abi as const

