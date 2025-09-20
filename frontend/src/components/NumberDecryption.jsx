import { useState } from 'react'
import { useFHEVM } from '../hooks/useFHEVM'
import { useAccount, useWalletClient } from 'wagmi'
import { useNumberStorage } from '../hooks/useContracts'

const NumberDecryption = () => {
  const { instance, isInitialized } = useFHEVM()
  const { address, chainId } = useAccount()
  const { data: walletClient } = useWalletClient()
  const [isDecrypting, setIsDecrypting] = useState(false)
  const [decryptedValue, setDecryptedValue] = useState(null)
  const [ciphertextHandle, setCiphertextHandle] = useState('')

  // 使用NumberStorage合约钩子
  const {
    contractAddress: CONTRACT_ADDRESS,
    storedNumber,
    isGettingStored,
    getStoredError
  } = useNumberStorage()

  const handleDecryptNumber = async () => {
    if (!instance || !ciphertextHandle || !address || !walletClient) {
      alert('请确保钱包已连接且输入了密文句柄')
      return
    }

    setIsDecrypting(true)
    try {
      // 生成密钥对
      const keypair = instance.generateKeypair()

      // 准备用户解密请求
      const handleContractPairs = [
        {
          handle: ciphertextHandle,
          contractAddress: CONTRACT_ADDRESS,
        },
      ]

      const startTimeStamp = Math.floor(Date.now() / 1000).toString()
      const durationDays = "10"
      const contractAddresses = [CONTRACT_ADDRESS]

      // 创建EIP712签名数据
      const eip712 = instance.createEIP712(
        keypair.publicKey,
        contractAddresses,
        startTimeStamp,
        durationDays
      )

      // 用户签名
      const signature = await walletClient.signTypedData({
        domain: eip712.domain,
        types: {
          UserDecryptRequestVerification: eip712.types.UserDecryptRequestVerification,
        },
        primaryType: 'UserDecryptRequestVerification',
        message: eip712.message
      })

      // 执行用户解密
      const result = await instance.userDecrypt(
        handleContractPairs,
        keypair.privateKey,
        keypair.publicKey,
        signature.replace("0x", ""),
        contractAddresses,
        address,
        startTimeStamp,
        durationDays
      )

      const decryptedValue = result[ciphertextHandle]
      setDecryptedValue(decryptedValue)

      console.log('解密成功:', decryptedValue)
    } catch (error) {
      console.error('解密失败:', error)
      alert('解密失败: ' + error.message)
    } finally {
      setIsDecrypting(false)
    }
  }

  const handleFetchFromContract = async () => {
    // 从合约获取用户的加密数字
    try {
      if (!storedNumber) {
        alert('您还没有在合约中存储数字，请先前往步骤2存储数字')
        return
      }

      // 将storedNumber转换为字符串句柄
      const handle = storedNumber.toString()
      setCiphertextHandle(handle)
      console.log('已从合约获取密文句柄:', handle)
    } catch (error) {
      console.error('获取失败:', error)
      alert('获取失败: ' + error.message)
    }
  }

  if (!isInitialized) {
    return (
      <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', margin: '20px 0', opacity: 0.6 }}>
        <h3>步骤3: 数字解密读取</h3>
        <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
          <p>⏳ 请先完成步骤1中的SDK初始化</p>
          <p style={{ fontSize: '14px', color: '#666' }}>SDK必须初始化后才能进行解密操作</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', margin: '20px 0' }}>
      <h3>步骤3: 数字解密读取</h3>

      <div style={{ marginBottom: '20px' }}>
        <h4>学习目标：</h4>
        <ul>
          <li>从智能合约获取加密数据</li>
          <li>学习用户解密过程</li>
          <li>理解密钥对生成和签名</li>
        </ul>

        <div style={{ marginTop: '15px' }}>
          <h5>📝 智能合约读取代码:</h5>
          <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '6px', marginBottom: '10px' }}>
            <pre style={{ margin: 0, fontSize: '12px', overflow: 'auto' }}>{`// 从合约读取加密数据
function getStoredNumber() external view returns (euint32) {
    return userNumbers[msg.sender];
}

// 获取其他用户的加密数据（需要权限）
function getStoredNumberByUser(address user) external view returns (euint32) {
    return userNumbers[user];
}`}</pre>
          </div>

          <h5>📝 前端解密代码:</h5>
          <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '6px', marginBottom: '10px' }}>
            <pre style={{ margin: 0, fontSize: '12px', overflow: 'auto' }}>{`// 用户解密流程
const decryptData = async (ciphertextHandle) => {
  // 1. 生成临时密钥对
  const keypair = instance.generateKeypair()

  // 2. 准备解密请求
  const handleContractPairs = [{
    handle: ciphertextHandle,
    contractAddress: CONTRACT_ADDRESS
  }]

  // 3. 创建EIP712签名数据
  const eip712 = instance.createEIP712(
    keypair.publicKey,
    [CONTRACT_ADDRESS],
    timestamp,
    duration
  )

  // 4. 用户签名授权
  const signature = await walletClient.signTypedData({
    domain: eip712.domain,
    types: { UserDecryptRequestVerification: eip712.types.UserDecryptRequestVerification },
    primaryType: 'UserDecryptRequestVerification',
    message: eip712.message
  })

  // 5. 执行解密
  const result = await instance.userDecrypt(
    handleContractPairs,
    keypair.privateKey,
    keypair.publicKey,
    signature.replace("0x", ""),
    [CONTRACT_ADDRESS],
    userAddress,
    timestamp,
    duration
  )

  return result[ciphertextHandle]
}`}</pre>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h4>步骤1: 获取你的加密数字</h4>

        {isGettingStored && (
          <div style={{ padding: '10px', backgroundColor: '#f0f8ff', borderRadius: '4px', marginBottom: '10px' }}>
            ⏳ 正在从合约获取数字数据...
          </div>
        )}

        {getStoredError && (
          <div style={{ padding: '10px', backgroundColor: '#ffe6e6', borderRadius: '4px', marginBottom: '10px' }}>
            ❌ 获取数字失败，请检查网络连接
          </div>
        )}

        <button
          onClick={handleFetchFromContract}
          disabled={isGettingStored || !address}
          style={{
            padding: '10px 20px',
            backgroundColor: storedNumber ? '#4CAF50' : '#FF9800',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            opacity: (!address || isGettingStored) ? 0.6 : 1
          }}
        >
          {storedNumber ? '✅ 从合约获取我的加密数字' : '从合约获取我的加密数字'}
        </button>

        {!storedNumber && !isGettingStored && !getStoredError && (
          <p style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>
            💡 提示：如果没有存储数字，请先前往步骤2存储一个数字
          </p>
        )}
      </div>

      {ciphertextHandle && (
        <div style={{ marginBottom: '20px' }}>
          <h4>步骤2: 密文句柄</h4>
          <div style={{ backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '4px', marginBottom: '10px' }}>
            <code style={{ fontSize: '12px', wordBreak: 'break-all' }}>
              {ciphertextHandle}
            </code>
          </div>
          <p style={{ fontSize: '14px', color: '#666' }}>
            这是从区块链获取的加密数据句柄
          </p>
        </div>
      )}

      <div style={{ marginBottom: '20px' }}>
        <h4>步骤3: 解密数据</h4>
        <input
          type="text"
          value={ciphertextHandle}
          onChange={(e) => setCiphertextHandle(e.target.value)}
          placeholder="输入密文句柄（或点击上面按钮获取）"
          style={{
            width: '100%',
            padding: '8px',
            margin: '10px 0',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontSize: '12px'
          }}
        />

        <button
          onClick={handleDecryptNumber}
          disabled={!instance || !ciphertextHandle || isDecrypting}
          style={{
            padding: '10px 20px',
            backgroundColor: '#9C27B0',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {isDecrypting ? '解密中...' : '解密数字'}
        </button>
      </div>

      {decryptedValue !== null && (
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e8f5e8', borderRadius: '4px' }}>
          <h4>✅ 解密成功！</h4>
          <p><strong>解密结果:</strong> {decryptedValue.toString()}</p>
          <p style={{ fontSize: '14px', color: '#666' }}>
            🎉 恭喜！你已成功解密出原始数字。
          </p>
        </div>
      )}

      <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        <h5>解密过程说明：</h5>
        <ol>
          <li><strong>生成密钥对:</strong> 创建临时公私钥对用于解密</li>
          <li><strong>创建EIP712签名:</strong> 证明用户身份和权限</li>
          <li><strong>用户签名:</strong> 使用钱包对解密请求进行签名</li>
          <li><strong>执行解密:</strong> 通过Relayer服务解密数据</li>
        </ol>

        <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#fff3cd', borderRadius: '4px' }}>
          <strong>⚠️ 安全提醒:</strong> 只有拥有正确权限的用户才能解密数据。智能合约会通过ACL（访问控制列表）来管理解密权限。
        </div>
      </div>
    </div>
  )
}

export default NumberDecryption