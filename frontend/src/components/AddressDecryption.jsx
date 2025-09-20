import { useState } from 'react'
import { useFHEVM } from '../hooks/useFHEVM'
import { useAccount, useWalletClient } from 'wagmi'
import { getContractAddress } from '../config/contracts'

const AddressDecryption = () => {
  const { instance, isInitialized } = useFHEVM()
  const { address, chainId } = useAccount()
  const { data: walletClient } = useWalletClient()
  const [isDecrypting, setIsDecrypting] = useState(false)
  const [decryptedAddress, setDecryptedAddress] = useState(null)
  const [ciphertextHandle, setCiphertextHandle] = useState('')

  // 合约地址
  const CONTRACT_ADDRESS = getContractAddress('AddressStorage', chainId)

  const handleDecryptAddress = async () => {
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
      setDecryptedAddress(decryptedValue)

      console.log('地址解密成功:', decryptedValue)
    } catch (error) {
      console.error('解密失败:', error)
      alert('解密失败: ' + error.message)
    } finally {
      setIsDecrypting(false)
    }
  }

  const handleFetchFromContract = async () => {
    // 模拟从合约获取用户的加密地址
    try {
      // 这里将调用合约的getStoredAddress函数
      const mockHandle = '0x742d35cc6635c0532925a3b8d61267f10e3cc82700ff0000000000aa36a70300'
      setCiphertextHandle(mockHandle)
      console.log('已从合约获取地址密文句柄')
    } catch (error) {
      console.error('获取失败:', error)
      alert('获取失败: ' + error.message)
    }
  }

  const isValidEthereumAddress = (addr) => {
    return /^0x[a-fA-F0-9]{40}$/.test(addr)
  }

  if (!isInitialized) {
    return (
      <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', margin: '20px 0', opacity: 0.6 }}>
        <h3>步骤5: 地址解密读取</h3>
        <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
          <p>⏳ 请先完成步骤1中的SDK初始化</p>
          <p style={{ fontSize: '14px', color: '#666' }}>SDK必须初始化后才能进行解密操作</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', margin: '20px 0' }}>
      <h3>步骤5: 地址解密读取</h3>

      <div style={{ marginBottom: '20px' }}>
        <h4>学习目标：</h4>
        <ul>
          <li>从智能合约获取加密地址</li>
          <li>解密eaddress类型数据</li>
          <li>验证解密后的地址格式</li>
        </ul>

        <div style={{ marginTop: '15px' }}>
          <h5>📝 智能合约查询代码:</h5>
          <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '6px', marginBottom: '10px' }}>
            <pre style={{ margin: 0, fontSize: '12px', overflow: 'auto' }}>{`// 获取加密地址的合约函数
function getStoredAddress() external view returns (eaddress) {
    return userAddresses[msg.sender];
}

// 获取其他用户的加密地址（需要权限）
function getStoredAddressByUser(address user) external view returns (eaddress) {
    return userAddresses[user];
}

// 比较两个加密地址（返回比较结果）
function compareAddresses(address userA, address userB)
    external view returns (eaddress) {
    require(FHE.isInitialized(userAddresses[userA]), "UserA no address");
    require(FHE.isInitialized(userAddresses[userB]), "UserB no address");

    // 这里可以返回比较结果或其中一个地址
    return userAddresses[userA];
}`}</pre>
          </div>

          <h5>📝 前端地址解密代码:</h5>
          <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '6px', marginBottom: '10px' }}>
            <pre style={{ margin: 0, fontSize: '12px', overflow: 'auto' }}>{`// 地址解密完整流程
const decryptAddress = async (addressHandle) => {
  // 1. 生成解密密钥对
  const keypair = instance.generateKeypair()

  // 2. 准备解密请求
  const handleContractPairs = [{
    handle: addressHandle,
    contractAddress: CONTRACT_ADDRESS
  }]

  // 3. 创建时间戳和有效期
  const startTimeStamp = Math.floor(Date.now() / 1000).toString()
  const durationDays = "10"

  // 4. 创建EIP712签名数据
  const eip712 = instance.createEIP712(
    keypair.publicKey,
    [CONTRACT_ADDRESS],
    startTimeStamp,
    durationDays
  )

  // 5. 用户签名
  const signature = await walletClient.signTypedData({
    domain: eip712.domain,
    types: { UserDecryptRequestVerification: eip712.types.UserDecryptRequestVerification },
    primaryType: 'UserDecryptRequestVerification',
    message: eip712.message
  })

  // 6. 执行解密
  const result = await instance.userDecrypt(
    handleContractPairs,
    keypair.privateKey,
    keypair.publicKey,
    signature.replace("0x", ""),
    [CONTRACT_ADDRESS],
    userAddress,
    startTimeStamp,
    durationDays
  )

  // 7. 返回解密后的地址
  return result[addressHandle]
}

// 验证地址格式
const isValidAddress = (addr) => {
  return /^0x[a-fA-F0-9]{40}$/.test(addr)
}`}</pre>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h4>步骤1: 获取你的加密地址</h4>
        <button
          onClick={handleFetchFromContract}
          style={{
            padding: '10px 20px',
            backgroundColor: '#FF9800',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          从合约获取我的加密地址
        </button>
      </div>

      {ciphertextHandle && (
        <div style={{ marginBottom: '20px' }}>
          <h4>步骤2: 地址密文句柄</h4>
          <div style={{ backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '4px', marginBottom: '10px' }}>
            <code style={{ fontSize: '12px', wordBreak: 'break-all' }}>
              {ciphertextHandle}
            </code>
          </div>
          <p style={{ fontSize: '14px', color: '#666' }}>
            这是从区块链获取的加密地址句柄
          </p>
        </div>
      )}

      <div style={{ marginBottom: '20px' }}>
        <h4>步骤3: 解密地址</h4>
        <input
          type="text"
          value={ciphertextHandle}
          onChange={(e) => setCiphertextHandle(e.target.value)}
          placeholder="输入地址密文句柄（或点击上面按钮获取）"
          style={{
            width: '100%',
            padding: '8px',
            margin: '10px 0',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontSize: '12px',
            fontFamily: 'monospace'
          }}
        />

        <button
          onClick={handleDecryptAddress}
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
          {isDecrypting ? '解密中...' : '解密地址'}
        </button>
      </div>

      {decryptedAddress !== null && (
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e8f5e8', borderRadius: '4px' }}>
          <h4>✅ 地址解密成功！</h4>
          <p><strong>解密结果:</strong></p>
          <code style={{
            fontSize: '14px',
            wordBreak: 'break-all',
            backgroundColor: '#f5f5f5',
            padding: '5px',
            borderRadius: '3px',
            display: 'block',
            margin: '10px 0'
          }}>
            {decryptedAddress}
          </code>

          <div style={{ marginTop: '15px' }}>
            {isValidEthereumAddress(decryptedAddress) ? (
              <div style={{ color: 'green' }}>
                ✅ 有效的以太坊地址格式
              </div>
            ) : (
              <div style={{ color: 'orange' }}>
                ⚠️ 这可能是随机生成的地址或特殊编码的地址
              </div>
            )}
          </div>

          <p style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>
            🎉 恭喜！你已成功解密出原始地址。
          </p>
        </div>
      )}

      <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        <h5>地址解密特点：</h5>
        <ul>
          <li><strong>eaddress类型:</strong> 160位加密地址，与euint160等价</li>
          <li><strong>格式验证:</strong> 解密后验证是否为有效的以太坊地址</li>
          <li><strong>随机地址:</strong> 合约生成的随机地址可能不符合常规格式</li>
          <li><strong>隐私保护:</strong> 地址信息在链上完全加密</li>
        </ul>

        <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#e3f2fd', borderRadius: '4px' }}>
          <h5>💡 应用场景：</h5>
          <ul>
            <li>匿名投票系统中的候选人地址</li>
            <li>私密转账的收款地址</li>
            <li>隐私拍卖中的竞标者地址</li>
            <li>保护用户隐私的DeFi协议</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default AddressDecryption