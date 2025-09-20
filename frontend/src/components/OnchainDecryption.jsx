import React, { useState, useEffect } from 'react'
import { useFHEVM } from '../hooks/useFHEVM'
import { useAccount } from 'wagmi'
import { useOnchainDecryption } from '../hooks/useContracts'

const OnchainDecryption = () => {
  const { instance, isInitialized } = useFHEVM()
  const { address, chainId } = useAccount()

  // 状态管理
  const [inputNumber, setInputNumber] = useState('')
  const [isEncrypting, setIsEncrypting] = useState(false)

  // 使用OnchainDecryption合约钩子
  const {
    contractAddress: CONTRACT_ADDRESS,
    storeEncryptedNumber,
    requestDecryptNumber,
    resetDecryptionState,
    decryptionStatus,
    isGettingStatus,
    getStatusError,
    isWriting
  } = useOnchainDecryption()

  // 轮询解密状态
  useEffect(() => {
    let interval
    if (decryptionStatus && decryptionStatus[0] === true) { // pending = true
      interval = setInterval(() => {
        // 状态会自动更新，因为useReadContract会持续轮询
      }, 2000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [decryptionStatus])

  // 加密并存储数字
  const handleEncryptAndStore = async () => {
    if (!instance || !address || !inputNumber) {
      alert('请确保钱包已连接、SDK已初始化并输入了数字')
      return
    }

    setIsEncrypting(true)
    try {
      // 创建加密输入
      const input = instance.createEncryptedInput(CONTRACT_ADDRESS, address)
      input.add32(parseInt(inputNumber))
      const encryptedInput = await input.encrypt()

      // 调用合约存储函数
      await storeEncryptedNumber(encryptedInput.handles[0])

      alert('数字加密存储成功！')
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

    try {
      // 调用合约解密请求函数
      await requestDecryptNumber()
      alert('解密请求已提交，请等待链上解密完成...')
    } catch (error) {
      console.error('请求解密失败:', error)
      alert('请求解密失败: ' + error.message)
    }
  }

  // 重置解密状态
  const handleReset = async () => {
    try {
      await resetDecryptionState()
      alert('解密状态已重置')
    } catch (error) {
      console.error('重置失败:', error)
      alert('重置失败: ' + error.message)
    }
  }

  if (!isInitialized) {
    return (
      <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', margin: '20px 0', opacity: 0.6 }}>
        <h3>步骤7: 链上解密请求</h3>
        <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
          <p>⏳ 请先完成步骤1中的SDK初始化</p>
          <p style={{ fontSize: '14px', color: '#666' }}>SDK必须初始化后才能进行解密操作</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', margin: '20px 0' }}>
      <h3>步骤7: 链上解密请求</h3>

      <div style={{ marginBottom: '20px' }}>
        <h4>学习目标：</h4>
        <ul>
          <li>理解requestDecryption机制</li>
          <li>学习异步解密回调流程</li>
          <li>掌握链上解密的最佳实践</li>
        </ul>

        <div style={{ marginTop: '15px' }}>
          <h5>📝 链上解密合约代码:</h5>
          <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '6px', marginBottom: '10px' }}>
            <pre style={{ margin: 0, fontSize: '12px', overflow: 'auto' }}>{`// 请求异步解密
function requestDecryptNumber() external returns (uint256) {
    require(FHE.isInitialized(userEncryptedNumbers[msg.sender]), "No encrypted number stored");
    require(!isDecryptionPending[msg.sender], "Decryption already pending");

    // 准备要解密的密文数组
    bytes32[] memory cts = new bytes32[](1);
    cts[0] = FHE.toBytes32(userEncryptedNumbers[msg.sender]);

    // 请求异步解密
    uint256 requestId = FHE.requestDecryption(
        cts,
        this.callbackDecryptNumber.selector
    );

    // 更新状态
    isDecryptionPending[msg.sender] = true;
    latestRequestIds[msg.sender] = requestId;
    requestIds[requestId] = msg.sender;

    emit DecryptionRequested(msg.sender, requestId);
    return requestId;
}

// 解密回调函数
function callbackDecryptNumber(
    uint256 requestId,
    bytes memory cleartexts,
    bytes memory decryptionProof
) public returns (bool) {
    // 验证请求ID
    address user = requestIds[requestId];
    require(user != address(0), "Invalid request ID");

    // 验证解密证明
    FHE.checkSignatures(requestId, cleartexts, decryptionProof);

    // 解码解密结果
    uint32 decryptedValue = abi.decode(cleartexts, (uint32));

    // 存储解密结果
    decryptedNumbers[user] = decryptedValue;
    isDecryptionPending[user] = false;

    emit DecryptionCompleted(user, decryptedValue);
    return true;
}`}</pre>
          </div>

          <h5>📝 前端解密请求代码:</h5>
          <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '6px', marginBottom: '10px' }}>
            <pre style={{ margin: 0, fontSize: '12px', overflow: 'auto' }}>{`// 1. 存储加密数字
const input = instance.createEncryptedInput(contractAddress, userAddress)
input.add32(number)
const encryptedInput = await input.encrypt()
await contract.storeEncryptedNumber(encryptedInput.handles[0])

// 2. 请求链上解密
const tx = await contract.requestDecryptNumber()
await tx.wait()

// 3. 监听解密状态
const decryptionStatus = await contract.getDecryptionStatus(userAddress)
// decryptionStatus: [pending, requestId, decryptedNumber]

// 4. 等待解密完成
// 解密由KMS异步完成，通过回调函数更新结果`}</pre>
          </div>
        </div>
      </div>

      {/* 步骤1: 输入和存储数字 */}
      <div style={{ marginBottom: '20px' }}>
        <h4>步骤1: 输入并存储加密数字</h4>
        <input
          type="number"
          value={inputNumber}
          onChange={(e) => setInputNumber(e.target.value)}
          placeholder="输入一个数字（例如: 42）"
          style={{
            padding: '8px',
            margin: '10px 0',
            border: '1px solid #ccc',
            borderRadius: '4px',
            width: '200px'
          }}
        />

        <button
          onClick={handleEncryptAndStore}
          disabled={isEncrypting || isWriting || !inputNumber}
          style={{
            padding: '10px 20px',
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginLeft: '10px',
            opacity: (!inputNumber || isEncrypting || isWriting) ? 0.6 : 1
          }}
        >
          {isEncrypting || isWriting ? '加密存储中...' : '加密并存储数字'}
        </button>
      </div>

      {/* 步骤2: 请求解密 */}
      <div style={{ marginBottom: '20px' }}>
        <h4>步骤2: 请求链上解密</h4>
        <button
          onClick={handleRequestDecryption}
          disabled={isWriting}
          style={{
            padding: '10px 20px',
            backgroundColor: '#FF9800',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginRight: '10px',
            opacity: isWriting ? 0.6 : 1
          }}
        >
          {isWriting ? '请求中...' : '请求解密'}
        </button>

        <button
          onClick={handleReset}
          disabled={isWriting}
          style={{
            padding: '10px 20px',
            backgroundColor: '#9E9E9E',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            opacity: isWriting ? 0.6 : 1
          }}
        >
          重置状态
        </button>
      </div>

      {/* 解密状态显示 */}
      <div style={{ marginBottom: '20px' }}>
        <h4>步骤3: 解密状态监控</h4>

        {isGettingStatus && (
          <div style={{ padding: '10px', backgroundColor: '#f0f8ff', borderRadius: '4px', marginBottom: '10px' }}>
            ⏳ 正在获取解密状态...
          </div>
        )}

        {getStatusError && (
          <div style={{ padding: '10px', backgroundColor: '#ffe6e6', borderRadius: '4px', marginBottom: '10px' }}>
            ❌ 获取状态失败，请检查网络连接
          </div>
        )}

        {decryptionStatus && (
          <div style={{
            padding: '15px',
            backgroundColor: decryptionStatus[0] ? '#fff3cd' : '#e8f5e8',
            borderRadius: '4px',
            border: decryptionStatus[0] ? '1px solid #ffeaa7' : '1px solid #c3e6cb'
          }}>
            <h5>解密状态信息：</h5>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '10px', alignItems: 'center' }}>
              <span><strong>解密状态:</strong></span>
              <span style={{ color: decryptionStatus[0] ? '#856404' : '#155724' }}>
                {decryptionStatus[0] ? '⏳ 解密进行中...' : '✅ 解密完成'}
              </span>

              <span><strong>请求ID:</strong></span>
              <code style={{ fontSize: '12px' }}>
                {decryptionStatus[1] ? decryptionStatus[1].toString() : '无'}
              </code>

              <span><strong>解密结果:</strong></span>
              <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#155724' }}>
                {decryptionStatus[2] ? decryptionStatus[2].toString() : '等待解密...'}
              </span>
            </div>

            {decryptionStatus[0] && (
              <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#ffeaa7', borderRadius: '4px' }}>
                <p style={{ margin: 0, fontSize: '14px' }}>
                  ⚡ 解密正在进行中，这个过程通常需要1-3分钟。
                  解密由Zama的KMS网络异步完成，完成后会自动更新状态。
                </p>
              </div>
            )}

            {!decryptionStatus[0] && decryptionStatus[2] && decryptionStatus[2] !== '0' && (
              <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#c3e6cb', borderRadius: '4px' }}>
                <p style={{ margin: 0, fontSize: '14px' }}>
                  🎉 恭喜！链上解密完成。原始数字 <strong>{inputNumber}</strong> 已成功解密为 <strong>{decryptionStatus[2].toString()}</strong>
                </p>
              </div>
            )}
          </div>
        )}

        {!decryptionStatus && !isGettingStatus && (
          <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
            <p style={{ margin: 0, color: '#666' }}>
              💡 请先存储一个加密数字，然后请求解密来查看状态
            </p>
          </div>
        )}
      </div>

      {/* 教学说明 */}
      <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        <h5>链上解密特点：</h5>
        <ul>
          <li><strong>异步处理:</strong> 解密请求提交后，由KMS网络异步处理</li>
          <li><strong>安全验证:</strong> 解密结果包含密码学证明，确保结果正确性</li>
          <li><strong>状态管理:</strong> 合约维护解密状态，防止重复请求</li>
          <li><strong>事件通知:</strong> 解密完成时发出事件，便于前端监听</li>
        </ul>

        <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#e3f2fd', borderRadius: '4px' }}>
          <h5>💡 应用场景：</h5>
          <ul>
            <li>拍卖结束后公开最高出价</li>
            <li>投票结束后公布投票结果</li>
            <li>游戏中随机数的公开揭晓</li>
            <li>隐私计算结果的条件性公开</li>
          </ul>
        </div>

        <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#fff3cd', borderRadius: '4px' }}>
          <h5>⚠️ 注意事项：</h5>
          <ul>
            <li>解密过程不可逆，一旦公开就无法撤回</li>
            <li>解密需要消耗一定的gas费用</li>
            <li>网络拥堵时解密可能需要更长时间</li>
            <li>确保在适当的时机调用解密请求</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default OnchainDecryption