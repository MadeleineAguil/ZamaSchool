import { useState } from 'react'
import { useFHEVM } from '../hooks/useFHEVM'
import { useAccount, useWalletClient } from 'wagmi'
import { useNumberStorage } from '../hooks/useContracts'
import { Contract } from 'ethers'
import { useEthersSigner } from '../hooks/useEthersSigner'
import NumberStorageABI from '../config/NumberStorageABI.json'

const NumberComparison = () => {
  const { instance, isInitialized } = useFHEVM()
  const { address, chainId } = useAccount()
  const { data: walletClient } = useWalletClient()
  const signer = useEthersSigner({ chainId })
  const [isComparing, setIsComparing] = useState(false)
  const [comparisonValue, setComparisonValue] = useState('')
  const [comparisonType, setComparisonType] = useState('equal')
  const [comparisonResult, setComparisonResult] = useState(null)
  const [isDecryptingResult, setIsDecryptingResult] = useState(false)
  const [userAAddress, setUserAAddress] = useState('')
  const [userBAddress, setUserBAddress] = useState('')
  const [isComparingTwoUsers, setIsComparingTwoUsers] = useState(false)

  // 使用NumberStorage合约钩子
  const {
    contractAddress: CONTRACT_ADDRESS,
    writeContract,
    storedNumber,
    isGettingStored,
    getStoredError
  } = useNumberStorage()

  const comparisonTypes = [
    { value: 'equal', label: '等于 (==)', description: '检查存储数字是否等于输入数字' },
    { value: 'greater', label: '大于 (>)', description: '检查存储数字是否大于输入数字' },
    { value: 'less', label: '小于 (<)', description: '检查存储数字是否小于输入数字' },
    { value: 'greater_or_equal', label: '大于等于 (>=)', description: '检查存储数字是否大于等于输入数字' },
    { value: 'less_or_equal', label: '小于等于 (<=)', description: '检查存储数字是否小于等于输入数字' }
  ]

  const handleSingleComparison = async () => {
    if (!instance || !comparisonValue || !address || !walletClient) {
      alert('请确保钱包已连接且输入了比较数字')
      return
    }

    if (!storedNumber) {
      alert('您还没有在合约中存储数字，请先存储一个数字')
      return
    }

    setIsComparing(true)
    try {
      // 创建加密输入
      const input = instance.createEncryptedInput(CONTRACT_ADDRESS, address)
      input.add32(parseInt(comparisonValue))
      const encryptedInput = await input.encrypt()

      // 根据比较类型调用不同的合约方法
      let functionName
      switch (comparisonType) {
        case 'equal':
          functionName = 'compareStoredNumberEqual'
          break
        case 'greater':
          functionName = 'compareStoredNumberGreater'
          break
        case 'less':
          functionName = 'compareStoredNumberLess'
          break
        case 'greater_or_equal':
          functionName = 'compareStoredNumberGreaterOrEqual'
          break
        case 'less_or_equal':
          functionName = 'compareStoredNumberLessOrEqual'
          break
        default:
          throw new Error('无效的比较类型')
      }

      // 调用合约方法
      const result = await writeContract({
        functionName,
        args: [encryptedInput.handles[0], encryptedInput.inputProof]
      })

      console.log('比较交易已提交:', result)
      alert('比较操作成功！等待交易确认后可以查看结果。')

    } catch (error) {
      console.error('比较失败:', error)
      alert('比较失败: ' + error.message)
    } finally {
      setIsComparing(false)
    }
  }

  const handleTwoUsersComparison = async () => {
    if (!userAAddress || !userBAddress || !address || !walletClient) {
      alert('请输入两个用户地址')
      return
    }

    setIsComparingTwoUsers(true)
    try {
      // 调用合约方法比较两个用户的数字
      const result = await writeContract({
        functionName: 'compareTwoUsersNumbers',
        args: [userAAddress, userBAddress, comparisonType]
      })

      console.log('用户比较交易已提交:', result)
      alert('用户比较操作成功！等待交易确认后可以查看结果。')

    } catch (error) {
      console.error('用户比较失败:', error)
      alert('用户比较失败: ' + error.message)
    } finally {
      setIsComparingTwoUsers(false)
    }
  }

  const handleDecryptComparisonResult = async () => {
    if (!instance || !address || !walletClient) {
      alert('请确保钱包已连接')
      return
    }

    setIsDecryptingResult(true)
    try {
      // 首先从合约获取比较结果
      const signerPromise = await signer
      const contract = new Contract(CONTRACT_ADDRESS, NumberStorageABI, signerPromise)
      const comparisonResultHandle = await contract.getComparisonResult(address)

      if (!comparisonResultHandle) {
        alert('没有找到比较结果，请先进行比较操作')
        return
      }

      // 生成密钥对
      const keypair = instance.generateKeypair()

      // 准备用户解密请求
      const handleContractPairs = [
        {
          handle: comparisonResultHandle.toString(),
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

      const decryptedResult = result[comparisonResultHandle.toString()]
      setComparisonResult(decryptedResult)

      console.log('解密比较结果:', decryptedResult)
    } catch (error) {
      console.error('解密比较结果失败:', error)
      alert('解密比较结果失败: ' + error.message)
    } finally {
      setIsDecryptingResult(false)
    }
  }

  if (!isInitialized) {
    return (
      <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', margin: '20px 0', opacity: 0.6 }}>
        <h3>FHE加密数字比较</h3>
        <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
          <p>⏳ 请先完成步骤1中的SDK初始化</p>
          <p style={{ fontSize: '14px', color: '#666' }}>SDK必须初始化后才能进行比较操作</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', margin: '20px 0' }}>
      <h3>FHE加密数字比较</h3>

      <div style={{ marginBottom: '20px' }}>
        <h4>学习目标：</h4>
        <ul>
          <li>掌握加密数据的比较操作</li>
          <li>学习不同比较运算符的使用</li>
          <li>理解加密布尔值的处理</li>
          <li>体验保护隐私的条件判断</li>
        </ul>

        <div style={{ marginTop: '15px' }}>
          <h5>📝 智能合约比较代码:</h5>
          <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '6px', marginBottom: '10px' }}>
            <pre style={{ margin: 0, fontSize: '12px', overflow: 'auto' }}>{`// 加密数字比较示例
function compareStoredNumberEqual(externalEuint32 inputNumber, bytes calldata inputProof) external {
    euint32 numberToCompare = FHE.fromExternal(inputNumber, inputProof);
    ebool result = FHE.eq(userNumbers[msg.sender], numberToCompare);  // 相等比较

    comparisonResults[msg.sender] = result;
    FHE.allowThis(comparisonResults[msg.sender]);
    FHE.allow(comparisonResults[msg.sender], msg.sender);
}

// 其他比较运算符
FHE.gt(a, b)  // 大于
FHE.lt(a, b)  // 小于
FHE.ge(a, b)  // 大于等于
FHE.le(a, b)  // 小于等于
FHE.ne(a, b)  // 不等于`}</pre>
          </div>

          <h5>📝 前端比较代码:</h5>
          <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '6px', marginBottom: '10px' }}>
            <pre style={{ margin: 0, fontSize: '12px', overflow: 'auto' }}>{`// 前端加密比较流程
const compareNumbers = async (compareValue, comparisonType) => {
  // 1. 创建加密输入
  const input = instance.createEncryptedInput(contractAddress, userAddress)
  input.add32(parseInt(compareValue))
  const encryptedInput = await input.encrypt()

  // 2. 调用合约比较方法
  const result = await contract.compareStoredNumberEqual(
    encryptedInput.handles[0],
    encryptedInput.inputProof
  )

  // 3. 解密布尔结果
  const comparisonResult = await userDecrypt(resultHandle)
  console.log('比较结果:', comparisonResult) // true/false
}`}</pre>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#e3f2fd', borderRadius: '8px' }}>
        <h4>方案一：与指定数字比较</h4>
        <p style={{ fontSize: '14px', color: '#666', marginBottom: '15px' }}>
          将你存储的加密数字与输入的数字进行比较
        </p>

        {!storedNumber && (
          <div style={{ padding: '10px', backgroundColor: '#fff3cd', borderRadius: '4px', marginBottom: '15px' }}>
            ⚠️ 您还没有存储数字，请先前往数字存储章节存储一个数字
          </div>
        )}

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            选择比较类型：
          </label>
          <select
            value={comparisonType}
            onChange={(e) => setComparisonType(e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              marginBottom: '5px'
            }}
          >
            {comparisonTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>
            {comparisonTypes.find(t => t.value === comparisonType)?.description}
          </p>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            输入比较数字：
          </label>
          <input
            type="number"
            value={comparisonValue}
            onChange={(e) => setComparisonValue(e.target.value)}
            placeholder="请输入要比较的数字"
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
        </div>

        <button
          onClick={handleSingleComparison}
          disabled={!instance || !comparisonValue || !storedNumber || isComparing}
          style={{
            padding: '10px 20px',
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            opacity: (!instance || !comparisonValue || !storedNumber || isComparing) ? 0.6 : 1
          }}
        >
          {isComparing ? '比较中...' : '执行比较'}
        </button>
      </div>

      <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#f3e5f5', borderRadius: '8px' }}>
        <h4>方案二：比较两个用户的数字</h4>
        <p style={{ fontSize: '14px', color: '#666', marginBottom: '15px' }}>
          比较两个不同用户存储的加密数字大小
        </p>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            用户A地址：
          </label>
          <input
            type="text"
            value={userAAddress}
            onChange={(e) => setUserAAddress(e.target.value)}
            placeholder="输入用户A的地址"
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            用户B地址：
          </label>
          <input
            type="text"
            value={userBAddress}
            onChange={(e) => setUserBAddress(e.target.value)}
            placeholder="输入用户B的地址"
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
          <button
            onClick={() => setUserBAddress(address)}
            style={{
              marginTop: '5px',
              padding: '5px 10px',
              backgroundColor: '#757575',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            使用我的地址
          </button>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            比较类型：
          </label>
          <select
            value={comparisonType}
            onChange={(e) => setComparisonType(e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          >
            <option value="equal">相等</option>
            <option value="greater">用户A 大于 用户B</option>
            <option value="less">用户A 小于 用户B</option>
          </select>
        </div>

        <button
          onClick={handleTwoUsersComparison}
          disabled={!instance || !userAAddress || !userBAddress || isComparingTwoUsers}
          style={{
            padding: '10px 20px',
            backgroundColor: '#9C27B0',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            opacity: (!instance || !userAAddress || !userBAddress || isComparingTwoUsers) ? 0.6 : 1
          }}
        >
          {isComparingTwoUsers ? '比较中...' : '比较两个用户'}
        </button>
      </div>

      <div style={{ marginBottom: '20px', padding: '20px', backgroundColor: '#e8f5e8', borderRadius: '8px' }}>
        <h4>查看比较结果</h4>
        <p style={{ fontSize: '14px', color: '#666', marginBottom: '15px' }}>
          比较操作完成后，点击按钮解密查看结果
        </p>

        <button
          onClick={handleDecryptComparisonResult}
          disabled={!instance || isDecryptingResult}
          style={{
            padding: '10px 20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            opacity: (!instance || isDecryptingResult) ? 0.6 : 1
          }}
        >
          {isDecryptingResult ? '解密中...' : '解密比较结果'}
        </button>

        {comparisonResult !== null && (
          <div style={{ marginTop: '15px', padding: '15px', backgroundColor: 'white', borderRadius: '4px', border: '1px solid #c8e6c9' }}>
            <h5>✅ 比较结果：</h5>
            <p style={{ fontSize: '18px', fontWeight: 'bold', color: comparisonResult ? '#4CAF50' : '#f44336' }}>
              {comparisonResult ? 'TRUE ✓' : 'FALSE ✗'}
            </p>
            <p style={{ fontSize: '14px', color: '#666' }}>
              {comparisonResult ? '条件成立' : '条件不成立'}
            </p>
          </div>
        )}
      </div>

      <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        <h5>加密比较的特点：</h5>
        <ul>
          <li><strong>隐私保护:</strong> 比较过程中数据始终保持加密状态</li>
          <li><strong>结果加密:</strong> 比较结果（布尔值）也是加密的</li>
          <li><strong>零知识:</strong> 第三方无法知道具体的数值，只能知道比较结果</li>
          <li><strong>可组合性:</strong> 可以基于比较结果进行更复杂的逻辑运算</li>
        </ul>

        <div style={{ marginTop: '15px', padding: '15px', backgroundColor: '#fff3cd', borderRadius: '4px' }}>
          <strong>💡 应用场景:</strong>
          <br />
          • 隐私拍卖（比较出价高低）
          <br />
          • 保密投票（比较选票数量）
          <br />
          • 信用评估（比较信用分数）
          <br />
          • 隐私排名（比较用户得分）
        </div>
      </div>
    </div>
  )
}

export default NumberComparison