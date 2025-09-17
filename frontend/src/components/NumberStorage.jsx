import { useState } from 'react'
import { useFHEVM } from '../hooks/useFHEVM'
import { useNumberStorage } from '../hooks/useContracts'
import { useAccount } from 'wagmi'

const NumberStorage = () => {
  const { instance, isInitialized } = useFHEVM()
  const { address } = useAccount()
  const {
    contractAddress,
    storeNumber,
    isStoring,
    storeData,
    storedNumber,
    isGettingStored,
    getStoredError
  } = useNumberStorage()

  const [number, setNumber] = useState('')
  const [isEncrypting, setIsEncrypting] = useState(false)
  const [encryptedData, setEncryptedData] = useState(null)

  const handleEncryptNumber = async () => {
    if (!instance || !number || !address) {
      alert('请确保钱包已连接且输入了数字')
      return
    }

    setIsEncrypting(true)
    try {
      // 创建加密输入
      const input = instance.createEncryptedInput(contractAddress, address)
      input.add32(parseInt(number))

      const encryptedInput = await input.encrypt()

      setEncryptedData({
        handle: encryptedInput.handles[0],
        inputProof: encryptedInput.inputProof
      })

      console.log('加密成功:', encryptedInput)
    } catch (error) {
      console.error('加密失败:', error)
      alert('加密失败: ' + error.message)
    } finally {
      setIsEncrypting(false)
    }
  }

  const handleStoreNumber = async () => {
    if (!encryptedData) {
      alert('请先加密数字')
      return
    }

    try {
      // 调用合约存储加密数字
      storeNumber({
        args: [encryptedData.handle, encryptedData.inputProof]
      })
    } catch (error) {
      console.error('存储失败:', error)
      alert('存储失败: ' + error.message)
    }
  }

  if (!isInitialized) {
    return (
      <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', margin: '20px 0', opacity: 0.6 }}>
        <h3>步骤2: 数字加密存储</h3>
        <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
          <p>⏳ 请先完成步骤1中的SDK初始化</p>
          <p style={{ fontSize: '14px', color: '#666' }}>SDK必须初始化后才能进行加密操作</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', margin: '20px 0' }}>
      <h3>步骤2: 数字加密存储</h3>

      <div style={{ marginBottom: '20px' }}>
        <h4>学习目标：</h4>
        <ul>
          <li>学习如何加密用户输入的数字</li>
          <li>了解加密数据的结构</li>
          <li>将加密数据存储到区块链</li>
        </ul>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h4>输入要加密的数字：</h4>
        <input
          type="number"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          placeholder="输入一个32位整数"
          style={{
            width: '200px',
            padding: '8px',
            margin: '10px 0',
            border: '1px solid #ccc',
            borderRadius: '4px'
          }}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={handleEncryptNumber}
          disabled={!instance || !number || isEncrypting}
          style={{
            padding: '10px 20px',
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          {isEncrypting ? '加密中...' : '加密数字'}
        </button>

        {encryptedData && (
          <button
            onClick={handleStoreNumber}
            style={{
              padding: '10px 20px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            存储到区块链
          </button>
        )}
      </div>

      {encryptedData && (
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f0f8ff', borderRadius: '4px' }}>
          <h4>✅ 加密成功！</h4>
          <p><strong>原始数字:</strong> {number}</p>
          <p><strong>加密句柄:</strong></p>
          <code style={{ fontSize: '12px', wordBreak: 'break-all' }}>
            {encryptedData.handle}
          </code>
          <p style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
            📝 加密句柄是加密数据的唯一标识符，用于在智能合约中引用这个加密的数字。
          </p>
        </div>
      )}

      {storeData && (
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e8f5e8', borderRadius: '4px' }}>
          <h4>✅ 存储成功！</h4>
          <p><strong>交易哈希:</strong> {storeData.hash}</p>
          <p><strong>合约地址:</strong> {contractAddress}</p>
          <p style={{ fontSize: '14px', color: '#666' }}>
            你的加密数字已安全存储在区块链上！
          </p>
        </div>
      )}

      {storedNumber && (
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f0f8ff', borderRadius: '4px' }}>
          <h4>📖 已存储的数字</h4>
          <p><strong>密文句柄:</strong></p>
          <code style={{ fontSize: '12px', wordBreak: 'break-all' }}>
            {storedNumber}
          </code>
          <p style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>
            这是你存储在合约中的加密数字的句柄
          </p>
        </div>
      )}

      <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        <h5>技术说明：</h5>
        <ul>
          <li><strong>euint32:</strong> 32位加密无符号整数类型</li>
          <li><strong>加密句柄:</strong> 指向区块链上加密数据的引用</li>
          <li><strong>输入证明:</strong> 证明加密数据的有效性</li>
        </ul>
      </div>
    </div>
  )
}

export default NumberStorage