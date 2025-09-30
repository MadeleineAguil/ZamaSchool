import { useState } from 'react'
import { useFHEVM } from '../hooks/useFHEVM'
import { useAccount } from 'wagmi'

const SDKDemo = () => {
  const { instance, isLoading, error, isInitialized, initFHEVM } = useFHEVM()
  const [installationComplete, setInstallationComplete] = useState(false)
  const { address } = useAccount()

  const handleInstallSDK = () => {
    // Simulate installation process
    setInstallationComplete(true)
  }

  const handleInitSDK = async () => {
    if (!address) {
      alert('Please connect your wallet first')
      return
    }
    console.log('Starting SDK initialization...')
    const success = await initFHEVM()
    console.log('Initialization complete, result:', success)
    // Note: State may not be updated immediately due to React's asynchronous state updates
  }

  return (
    <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', margin: '20px 0' }}>
      <h3>Step 1: Zama Frontend SDK Introduction</h3>

      <div style={{ marginBottom: '20px' }}>
        <h4>What is Zama SDK?</h4>
        <p>Zama SDK is a JavaScript library used to interact with FHEVM (Fully Homomorphic Encryption Virtual Machine) in frontend applications.</p>
        <ul>
          <li>Supports data encryption and decryption</li>
          <li>Seamless integration with smart contracts</li>
          <li>Protects user data privacy</li>
        </ul>

        <div style={{ marginTop: '15px' }}>
          <h5>📝 Frontend Code Example:</h5>
          <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '6px', marginBottom: '10px' }}>
            <pre style={{ margin: 0, fontSize: '12px', overflow: 'auto' }}>{`// 1. Import SDK
import { createInstance, SepoliaConfig } from '@zama-fhe/relayer-sdk'

// 2. Create FHEVM instance
const instance = await createInstance({
  ...SepoliaConfig,
  network: window.ethereum
})

// 3. Create encrypted input
const input = instance.createEncryptedInput(contractAddress, userAddress)
input.add32(42)  // Encrypt a 32-bit number
const encryptedInput = await input.encrypt()

// 4. Call contract method
await contract.storeNumber(
  encryptedInput.handles[0],
  encryptedInput.inputProof
)`}</pre>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h4>Step 1: Install SDK</h4>
        <div style={{ backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '4px', marginBottom: '10px' }}>
          <code>npm install @zama-fhe/relayer-sdk</code>
        </div>

        {!installationComplete ? (
          <button
            onClick={handleInstallSDK}
            style={{
              padding: '10px 20px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Click to Install SDK
          </button>
        ) : (
          <div style={{ color: 'green', marginBottom: '20px' }}>
            ✅ SDK installed successfully!
          </div>
        )}
      </div>

      {installationComplete && (
        <div style={{ marginBottom: '20px' }}>
          <h4>Step 2: Initialize SDK</h4>
          <p style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>
            Click the button below to initialize the Zama SDK. This will create an FHEVM instance for subsequent encryption operations.
          </p>

          {!address && (
            <div style={{ color: '#ff9800', marginBottom: '10px' }}>
              ⚠️ Please connect your wallet before initializing the SDK
            </div>
          )}

          {!isInitialized ? (
            <button
              onClick={handleInitSDK}
              disabled={!address || isLoading}
              style={{
                padding: '10px 20px',
                backgroundColor: address ? '#2196F3' : '#ccc',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: address ? 'pointer' : 'not-allowed'
              }}
            >
              {isLoading ? 'Initializing...' : 'Click to Initialize SDK'}
            </button>
          ) : (
            <div style={{ color: 'green' }}>
              ✅ SDK initialized successfully!
            </div>
          )}

          {error && (
            <div style={{ color: 'red', marginTop: '10px' }}>
              ❌ Initialization failed: {error}
            </div>
          )}
        </div>
      )}

      {instance && isInitialized && (
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e8f5e8', borderRadius: '4px' }}>
          <h4>🎉 FHEVM Instance Created</h4>
          <p>SDK has been successfully initialized, now you can perform encryption operations!</p>
          <div style={{ marginTop: '10px' }}>
            <h5>Instance Configuration:</h5>
            <ul style={{ fontSize: '12px' }}>
              <li>Network: Sepolia Testnet</li>
              <li>Chain ID: 11155111</li>
              <li>Gateway Chain ID: 55815</li>
              <li>Relayer Service: Connected</li>
            </ul>
          </div>
        </div>
      )}

      <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        <h5>What You Will Learn Next:</h5>
        <ol>
          <li>Encrypted number storage</li>
          <li>Number decryption and retrieval</li>
          <li>Encrypted address storage</li>
          <li>Address decryption and retrieval</li>
          <li>FHE calculation operations</li>
        </ol>

        {!isInitialized && (
          <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#fff3cd', borderRadius: '4px' }}>
            <strong>📝 Note:</strong> Please complete SDK initialization before proceeding to the next step. The initialization process creates a connection to the Zama network, which is a prerequisite for performing encryption operations.
          </div>
        )}
      </div>
    </div>
  )
}

export default SDKDemo