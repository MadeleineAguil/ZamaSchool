import React, { useState, useEffect } from 'react'
import { useFHEVM } from '../hooks/useFHEVM'
import { useAccount } from 'wagmi'
import { getContractAddress } from '../config/contracts'

const OnchainDecryption = () => {
  const { instance, isInitialized } = useFHEVM()
  const { address, chainId } = useAccount()

  // 状态管理
  const [inputNumber, setInputNumber] = useState('')
  const [inputBoolean, setInputBoolean] = useState(false)
  const [inputAddress, setInputAddress] = useState('')
  const [isEncrypting, setIsEncrypting] = useState(false)
  const [isRequesting, setIsRequesting] = useState(false)
  const [decryptionStatus, setDecryptionStatus] = useState(null)
  const [requestId, setRequestId] = useState(null)
  const [selectedDataType, setSelectedDataType] = useState('number')

  // 合约地址
  const CONTRACT_ADDRESS = getContractAddress('OnchainDecryption', chainId)

  // 数据类型选项
  const dataTypes = [
    { value: 'number', label: '数字 (euint32)', description: '32位加密无符号整数' },
    { value: 'boolean', label: '布尔值 (ebool)', description: '加密布尔类型' },
    { value: 'address', label: '地址 (eaddress)', description: '加密以太坊地址' },
    { value: 'batch', label: '批量解密', description: '同时解密数字和布尔值' }
  ]

  // 监听合约事件
  useEffect(() => {
    if (!CONTRACT_ADDRESS) return

    // 这里应该监听合约的DecryptionCompleted事件
    // 实际实现需要配置事件监听器
  }, [CONTRACT_ADDRESS])

  // 加密并存储数据
  const handleEncryptAndStore = async () => {
    if (!instance || !address) {
      alert('请确保钱包已连接且SDK已初始化')
      return
    }

    setIsEncrypting(true)
    try {
      const input = instance.createEncryptedInput(CONTRACT_ADDRESS, address)

      let functionName = ''
      let encryptedData = null

      switch (selectedDataType) {
        case 'number':
          if (!inputNumber) {
            alert('请输入数字')
            return
          }
          input.add32(parseInt(inputNumber))
          functionName = 'storeEncryptedNumber'
          break

        case 'boolean':
          input.addBool(inputBoolean)
          functionName = 'storeEncryptedBoolean'
          break

        case 'address':
          if (!inputAddress) {
            alert('请输入地址')
            return
          }
          input.addAddress(inputAddress)
          functionName = 'storeEncryptedAddress'
          break

        case 'batch':
          if (!inputNumber) {
            alert('请输入数字用于批量演示')
            return
          }
          input.add32(parseInt(inputNumber))
          input.addBool(inputBoolean)
          // 批量存储需要分别调用
          break
      }

      const encryptedInput = await input.encrypt()

      // 模拟调用合约存储函数
      console.log(`调用合约函数: ${functionName}`)
      console.log('加密数据:', encryptedInput)

      // 实际实现中应该调用真实的合约函数
      // await contract[functionName](encryptedInput.handles[0], encryptedInput.inputProof)

      alert(`${dataTypes.find(dt => dt.value === selectedDataType).label} 加密存储成功！`)

    } catch (error) {
      console.error('加密存储失败:', error)
      alert('加密存储失败: ' + error.message)
    } finally {
      setIsEncrypting(false)
    }
  }

  // 请求链上解密
  const handleRequestDecryption = async () => {
    if (!address) {
      alert('请连接钱包')
      return
    }

    setIsRequesting(true)
    try {
      let functionName = ''

      switch (selectedDataType) {
        case 'number':
          functionName = 'requestDecryptNumber'
          break
        case 'boolean':
          functionName = 'requestDecryptBoolean'
          break
        case 'address':
          functionName = 'requestDecryptAddress'
          break
        case 'batch':
          functionName = 'requestBatchDecryption'
          break
      }

      // 模拟调用合约解密请求函数
      console.log(`调用合约函数: ${functionName}`)

      // 模拟返回的请求ID
      const mockRequestId = Math.floor(Math.random() * 1000000)
      setRequestId(mockRequestId)

      // 模拟解密状态
      setDecryptionStatus({
        pending: true,
        requestId: mockRequestId,
        dataType: selectedDataType
      })

      // 模拟异步解密完成（实际中由合约回调触发）
      setTimeout(() => {
        const mockResults = {
          number: Math.floor(Math.random() * 1000),
          boolean: Math.random() > 0.5,
          address: `0x${'a'.repeat(40)}`,
          batch: {
            number: Math.floor(Math.random() * 1000),
            boolean: Math.random() > 0.5
          }
        }

        setDecryptionStatus({
          pending: false,
          requestId: mockRequestId,
          dataType: selectedDataType,
          result: mockResults[selectedDataType] || mockResults.batch
        })
      }, 3000) // 3秒后模拟解密完成

      alert('解密请求已提交，请等待链上解密完成...')

    } catch (error) {
      console.error('请求解密失败:', error)
      alert('请求解密失败: ' + error.message)
    } finally {
      setIsRequesting(false)
    }
  }

  // 重置状态
  const handleReset = () => {
    setDecryptionStatus(null)
    setRequestId(null)
    setInputNumber('')
    setInputBoolean(false)
    setInputAddress('')
  }

  if (!isInitialized) {
    return (
      <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', margin: '20px 0', opacity: 0.6 }}>
        <h3>链上解密教学</h3>
        <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
          <p>⏳ 请先完成SDK初始化</p>
          <p style={{ fontSize: '14px', color: '#666' }}>SDK必须初始化后才能进行解密操作</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', margin: '20px 0' }}>
      <h3>链上解密教学 (requestDecryption)</h3>

      <div style={{ marginBottom: '20px' }}>
        <h4>学习目标：</h4>
        <ul>
          <li>理解链上解密的异步机制</li>
          <li>学习requestDecryption的使用方法</li>
          <li>掌握解密回调函数的实现</li>
          <li>体验批量解密功能</li>
        </ul>

        <div style={{ marginTop: '15px' }}>
          <h5>📝 智能合约链上解密代码:</h5>
          <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '6px', marginBottom: '10px' }}>
            <pre style={{ margin: 0, fontSize: '12px', overflow: 'auto' }}>{`// OnchainDecryption.sol - 链上解密示例

// 请求解密函数
function requestDecryptNumber() external returns (uint256) {
    require(FHE.isInitialized(userEncryptedNumbers[msg.sender]), "No encrypted number");
    require(!isDecryptionPending[msg.sender], "Decryption already pending");

    // 准备要解密的密文数组
    bytes32[] memory cts = new bytes32[](1);
    cts[0] = FHE.toBytes32(userEncryptedNumbers[msg.sender]);

    // 请求异步解密
    uint256 requestId = FHE.requestDecryption(
        cts,
        this.callbackDecryptNumber.selector  // 回调函数
    );

    isDecryptionPending[msg.sender] = true;
    latestRequestIds[msg.sender] = requestId;

    emit DecryptionRequested(msg.sender, requestId, "euint32");
    return requestId;
}

// 解密回调函数
function callbackDecryptNumber(
    uint256 requestId,
    bytes memory cleartexts,
    bytes memory decryptionProof
) public returns (bool) {
    // 验证请求ID和解密证明
    address user = getUserByRequestId(requestId);
    require(requestId == latestRequestIds[user], "Request ID mismatch");
    FHE.checkSignatures(requestId, cleartexts, decryptionProof);

    // 解码解密结果
    uint32 decryptedValue = abi.decode(cleartexts, (uint32));

    // 存储解密结果
    decryptedNumbers[user] = decryptedValue;
    isDecryptionPending[user] = false;

    emit DecryptionCompleted(user, "euint32");
    return true;
}

// 批量解密示例
function requestBatchDecryption() external returns (uint256) {
    bytes32[] memory cts = new bytes32[](2);
    cts[0] = FHE.toBytes32(userEncryptedNumbers[msg.sender]);
    cts[1] = FHE.toBytes32(userEncryptedBooleans[msg.sender]);

    return FHE.requestDecryption(cts, this.callbackBatchDecryption.selector);
}`}</pre>
          </div>

          <h5>📝 前端链上解密调用代码:</h5>
          <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '6px', marginBottom: '10px' }}>
            <pre style={{ margin: 0, fontSize: '12px', overflow: 'auto' }}>{`// 前端请求链上解密

// 1. 调用合约请求解密
const requestDecryption = async () => {
  const tx = await contract.requestDecryptNumber()
  const receipt = await tx.wait()

  // 获取请求ID（从事件中）
  const event = receipt.events.find(e => e.event === 'DecryptionRequested')
  const requestId = event.args.requestId

  console.log('解密请求ID:', requestId)
  return requestId
}

// 2. 监听解密完成事件
const listenForDecryption = (requestId) => {
  contract.on('DecryptionCompleted', (user, dataType, event) => {
    if (user === userAddress) {
      console.log('解密完成:', dataType)
      // 获取解密结果
      getDecryptionResult()
    }
  })
}

// 3. 获取解密结果
const getDecryptionResult = async () => {
  const result = await contract.decryptedNumbers(userAddress)
  console.log('解密结果:', result.toString())
  return result
}

// 4. 批量解密处理
const handleBatchDecryption = async () => {
  const requestId = await contract.requestBatchDecryption()

  // 监听批量解密完成
  contract.once('DecryptionCompleted', async (user, dataType) => {
    if (dataType === 'batch') {
      const numberResult = await contract.decryptedNumbers(user)
      const boolResult = await contract.decryptedBooleans(user)
      console.log('批量解密结果:', { numberResult, boolResult })
    }
  })
}`}</pre>
          </div>
        </div>
      </div>

      {/* 数据类型选择 */}
      <div style={{ marginBottom: '20px' }}>
        <h4>步骤1: 选择数据类型</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {dataTypes.map((type) => (
            <label
              key={type.value}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px',
                border: selectedDataType === type.value ? '2px solid #2196F3' : '1px solid #ddd',
                borderRadius: '6px',
                cursor: 'pointer',
                backgroundColor: selectedDataType === type.value ? '#f0f8ff' : 'white'
              }}
            >
              <input
                type="radio"
                value={type.value}
                checked={selectedDataType === type.value}
                onChange={(e) => setSelectedDataType(e.target.value)}
                style={{ marginRight: '8px' }}
              />
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{type.label}</div>
                <div style={{ fontSize: '12px', color: '#666' }}>{type.description}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* 数据输入 */}
      <div style={{ marginBottom: '20px' }}>
        <h4>步骤2: 输入数据</h4>
        {selectedDataType === 'number' && (
          <input
            type="number"
            value={inputNumber}
            onChange={(e) => setInputNumber(e.target.value)}
            placeholder="输入要加密的数字"
            style={{
              width: '300px',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              marginRight: '10px'
            }}
          />
        )}

        {selectedDataType === 'boolean' && (
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="checkbox"
              checked={inputBoolean}
              onChange={(e) => setInputBoolean(e.target.checked)}
            />
            <span>布尔值: {inputBoolean ? 'true' : 'false'}</span>
          </label>
        )}

        {selectedDataType === 'address' && (
          <input
            type="text"
            value={inputAddress}
            onChange={(e) => setInputAddress(e.target.value)}
            placeholder="输入以太坊地址 (0x...)"
            style={{
              width: '400px',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontFamily: 'monospace'
            }}
          />
        )}

        {selectedDataType === 'batch' && (
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <input
              type="number"
              value={inputNumber}
              onChange={(e) => setInputNumber(e.target.value)}
              placeholder="数字"
              style={{
                width: '150px',
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
            />
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="checkbox"
                checked={inputBoolean}
                onChange={(e) => setInputBoolean(e.target.checked)}
              />
              <span>布尔值: {inputBoolean ? 'true' : 'false'}</span>
            </label>
          </div>
        )}
      </div>

      {/* 操作按钮 */}
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={handleEncryptAndStore}
          disabled={isEncrypting}
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
          {isEncrypting ? '加密存储中...' : '步骤3: 加密并存储'}
        </button>

        <button
          onClick={handleRequestDecryption}
          disabled={isRequesting}
          style={{
            padding: '10px 20px',
            backgroundColor: '#FF9800',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          {isRequesting ? '请求中...' : '步骤4: 请求链上解密'}
        </button>

        <button
          onClick={handleReset}
          style={{
            padding: '10px 20px',
            backgroundColor: '#9E9E9E',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          重置
        </button>
      </div>

      {/* 解密状态显示 */}
      {decryptionStatus && (
        <div style={{
          marginTop: '20px',
          padding: '20px',
          backgroundColor: decryptionStatus.pending ? '#fff3cd' : '#e8f5e8',
          borderRadius: '8px',
          border: `1px solid ${decryptionStatus.pending ? '#ffeaa7' : '#4CAF50'}`
        }}>
          <h4>
            {decryptionStatus.pending ? '⏳ 解密进行中...' : '✅ 解密完成！'}
          </h4>

          <div style={{ marginBottom: '15px' }}>
            <p><strong>请求ID:</strong> {decryptionStatus.requestId}</p>
            <p><strong>数据类型:</strong> {dataTypes.find(dt => dt.value === decryptionStatus.dataType)?.label}</p>
          </div>

          {decryptionStatus.pending && (
            <div style={{ padding: '15px', backgroundColor: 'white', borderRadius: '4px' }}>
              <h5>链上解密流程说明：</h5>
              <ol style={{ fontSize: '14px', lineHeight: '1.6' }}>
                <li>📤 合约调用 FHE.requestDecryption() 发起解密请求</li>
                <li>🔄 Zama网络的解密服务接收到请求</li>
                <li>🔐 在安全环境中执行解密操作</li>
                <li>📥 解密结果通过回调函数返回给合约</li>
                <li>✨ 合约验证结果并触发事件通知</li>
              </ol>
            </div>
          )}

          {!decryptionStatus.pending && decryptionStatus.result && (
            <div style={{ padding: '15px', backgroundColor: 'white', borderRadius: '4px' }}>
              <h5>🎉 解密结果：</h5>
              {decryptionStatus.dataType === 'batch' ? (
                <div>
                  <p><strong>数字:</strong> {decryptionStatus.result.number}</p>
                  <p><strong>布尔值:</strong> {decryptionStatus.result.boolean ? 'true' : 'false'}</p>
                </div>
              ) : (
                <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#2E7D32' }}>
                  {typeof decryptionStatus.result === 'boolean'
                    ? (decryptionStatus.result ? 'true' : 'false')
                    : decryptionStatus.result.toString()}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* 技术说明 */}
      <div style={{ marginTop: '30px', fontSize: '14px', color: '#666' }}>
        <h5>🔍 链上解密技术特点：</h5>
        <ul>
          <li><strong>异步处理:</strong> 解密操作在链下执行，通过回调函数返回结果</li>
          <li><strong>安全保证:</strong> 解密在Zama网络的可信环境中进行</li>
          <li><strong>结果验证:</strong> 回调函数会验证解密证明的有效性</li>
          <li><strong>事件通知:</strong> 解密完成后触发事件，前端可以监听</li>
          <li><strong>批量处理:</strong> 支持一次解密多个密文，提高效率</li>
        </ul>

        <div style={{ marginTop: '15px', padding: '15px', backgroundColor: '#e3f2fd', borderRadius: '4px' }}>
          <h5>💡 应用场景：</h5>
          <ul>
            <li>拍卖系统的竞价结果公开</li>
            <li>投票系统的最终计票结果</li>
            <li>游戏中的随机数生成结果</li>
            <li>DeFi协议的风险评估结果</li>
            <li>身份验证的最终判定结果</li>
          </ul>
        </div>

        <div style={{ marginTop: '15px', padding: '15px', backgroundColor: '#fff3cd', borderRadius: '4px' }}>
          <h5>⚠️ 重要提醒：</h5>
          <ul>
            <li>链上解密是不可逆的操作，一旦解密结果公开就无法撤回</li>
            <li>解密操作需要消耗额外的Gas费用</li>
            <li>回调函数必须正确实现，否则解密结果可能丢失</li>
            <li>建议在解密前确认业务逻辑的正确性</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default OnchainDecryption