import { useState } from 'react'
import { useFHEVM } from '../hooks/useFHEVM'
import { useAccount, useWalletClient } from 'wagmi'
import { getContractAddress } from '../config/contracts'

const FHECalculations = () => {
  const { instance, isInitialized } = useFHEVM()
  const { address, chainId } = useAccount()
  const { data: walletClient } = useWalletClient()
  const [operationNumber, setOperationNumber] = useState('')
  const [divisor, setDivisor] = useState('')
  const [selectedOperation, setSelectedOperation] = useState('add')
  const [isProcessing, setIsProcessing] = useState(false)
  const [calculationResult, setCalculationResult] = useState(null)
  const [currentStoredNumber, setCurrentStoredNumber] = useState(null)

  // 合约地址
  const CONTRACT_ADDRESS = getContractAddress('NumberStorage', chainId)

  const operations = [
    { value: 'add', label: '加法 (+)', description: '将你的存储数字与新数字相加' },
    { value: 'subtract', label: '减法 (-)', description: '从你的存储数字中减去新数字' },
    { value: 'multiply', label: '乘法 (×)', description: '将你的存储数字与新数字相乘' },
    { value: 'divide', label: '除法 (÷)', description: '将你的存储数字除以指定数字（明文除数）' }
  ]

  const handleGetStoredNumber = async () => {
    try {
      // 模拟从合约获取存储的数字
      setCurrentStoredNumber('42') // 模拟值
      console.log('已获取存储的数字')
    } catch (error) {
      console.error('获取失败:', error)
      alert('获取存储数字失败: ' + error.message)
    }
  }

  const handleCalculation = async () => {
    if (!instance || !address) {
      alert('请确保钱包已连接')
      return
    }

    if (selectedOperation === 'divide') {
      if (!divisor || parseInt(divisor) <= 0) {
        alert('请输入有效的除数（大于0的整数）')
        return
      }
    } else {
      if (!operationNumber) {
        alert('请输入要计算的数字')
        return
      }
    }

    setIsProcessing(true)
    try {
      let encryptedData = null

      if (selectedOperation !== 'divide') {
        // 创建加密输入（除法操作不需要加密输入）
        const input = instance.createEncryptedInput(CONTRACT_ADDRESS, address)
        input.add32(parseInt(operationNumber))
        const encryptedInput = await input.encrypt()

        encryptedData = {
          handle: encryptedInput.handles[0],
          inputProof: encryptedInput.inputProof
        }
      }

      // 模拟调用不同的合约函数
      let functionName = ''
      let params = []

      switch (selectedOperation) {
        case 'add':
          functionName = 'addToStoredNumber'
          params = [encryptedData.handle, encryptedData.inputProof]
          break
        case 'subtract':
          functionName = 'subtractFromStoredNumber'
          params = [encryptedData.handle, encryptedData.inputProof]
          break
        case 'multiply':
          functionName = 'multiplyStoredNumber'
          params = [encryptedData.handle, encryptedData.inputProof]
          break
        case 'divide':
          functionName = 'divideStoredNumber'
          params = [parseInt(divisor)]
          break
      }

      console.log(`调用合约函数: ${functionName}`, params)

      // 模拟交易结果
      setCalculationResult({
        operation: selectedOperation,
        operand: selectedOperation === 'divide' ? divisor : operationNumber,
        txHash: '0x模拟计算交易哈希...',
        resultHandle: '0x830a61b343d2f3de67ec59cb18961fd086085c1c73ff0000000000aa36a70800'
      })

    } catch (error) {
      console.error('计算失败:', error)
      alert('计算失败: ' + error.message)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDecryptResult = async () => {
    if (!calculationResult || !walletClient) {
      alert('没有可解密的结果或钱包未连接')
      return
    }

    try {
      // 模拟解密过程（实际实现参考NumberDecryption组件）
      console.log('解密计算结果...')

      // 模拟解密后的结果
      let mockResult = ''
      const stored = parseInt(currentStoredNumber || '42')
      const operand = parseInt(calculationResult.operand)

      switch (calculationResult.operation) {
        case 'add':
          mockResult = (stored + operand).toString()
          break
        case 'subtract':
          mockResult = (stored - operand).toString()
          break
        case 'multiply':
          mockResult = (stored * operand).toString()
          break
        case 'divide':
          mockResult = Math.floor(stored / operand).toString()
          break
      }

      setCalculationResult(prev => ({
        ...prev,
        decryptedResult: mockResult
      }))

    } catch (error) {
      console.error('解密失败:', error)
      alert('解密失败: ' + error.message)
    }
  }

  if (!isInitialized) {
    return (
      <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', margin: '20px 0', opacity: 0.6 }}>
        <h3>步骤6: FHE计算功能（加减乘除）</h3>
        <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
          <p>⏳ 请先完成步骤1中的SDK初始化</p>
          <p style={{ fontSize: '14px', color: '#666' }}>SDK必须初始化后才能进行计算操作</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', margin: '20px 0' }}>
      <h3>步骤6: FHE计算功能（加减乘除）</h3>

      <div style={{ marginBottom: '20px' }}>
        <h4>学习目标：</h4>
        <ul>
          <li>理解FHE同态计算原理</li>
          <li>学习加密数据的运算操作</li>
          <li>掌握不同运算类型的使用方法</li>
        </ul>

        <div style={{ marginTop: '15px' }}>
          <h5>📝 智能合约FHE运算代码:</h5>
          <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '6px', marginBottom: '10px' }}>
            <pre style={{ margin: 0, fontSize: '12px', overflow: 'auto' }}>{`// NumberStorage.sol - FHE运算函数

// 加法运算：密文 + 密文
function addToStoredNumber(externalEuint32 inputNumber, bytes calldata inputProof) external {
    require(FHE.isInitialized(userNumbers[msg.sender]), "No stored number");

    euint32 numberToAdd = FHE.fromExternal(inputNumber, inputProof);
    euint32 result = FHE.add(userNumbers[msg.sender], numberToAdd);

    calculationResults[msg.sender] = result;
    FHE.allowThis(calculationResults[msg.sender]);
    FHE.allow(calculationResults[msg.sender], msg.sender);

    emit CalculationPerformed(msg.sender, "addition");
}

// 减法运算：密文 - 密文
function subtractFromStoredNumber(externalEuint32 inputNumber, bytes calldata inputProof) external {
    require(FHE.isInitialized(userNumbers[msg.sender]), "No stored number");

    euint32 numberToSubtract = FHE.fromExternal(inputNumber, inputProof);
    euint32 result = FHE.sub(userNumbers[msg.sender], numberToSubtract);

    calculationResults[msg.sender] = result;
    FHE.allowThis(calculationResults[msg.sender]);
    FHE.allow(calculationResults[msg.sender], msg.sender);

    emit CalculationPerformed(msg.sender, "subtraction");
}

// 乘法运算：密文 × 密文
function multiplyStoredNumber(externalEuint32 inputNumber, bytes calldata inputProof) external {
    require(FHE.isInitialized(userNumbers[msg.sender]), "No stored number");

    euint32 numberToMultiply = FHE.fromExternal(inputNumber, inputProof);
    euint32 result = FHE.mul(userNumbers[msg.sender], numberToMultiply);

    calculationResults[msg.sender] = result;
    FHE.allowThis(calculationResults[msg.sender]);
    FHE.allow(calculationResults[msg.sender], msg.sender);

    emit CalculationPerformed(msg.sender, "multiplication");
}

// 除法运算：密文 ÷ 明文（除数必须是明文）
function divideStoredNumber(uint32 divisor) external {
    require(FHE.isInitialized(userNumbers[msg.sender]), "No stored number");
    require(divisor > 0, "Divisor must be greater than 0");

    euint32 result = FHE.div(userNumbers[msg.sender], divisor);

    calculationResults[msg.sender] = result;
    FHE.allowThis(calculationResults[msg.sender]);
    FHE.allow(calculationResults[msg.sender], msg.sender);

    emit CalculationPerformed(msg.sender, "division");
}

// 两个用户数字相加（演示多用户交互）
function addTwoStoredNumbers(address userA, address userB) external {
    require(FHE.isInitialized(userNumbers[userA]), "UserA has no stored number");
    require(FHE.isInitialized(userNumbers[userB]), "UserB has no stored number");

    euint32 result = FHE.add(userNumbers[userA], userNumbers[userB]);

    calculationResults[msg.sender] = result;
    FHE.allowThis(calculationResults[msg.sender]);
    FHE.allow(calculationResults[msg.sender], msg.sender);

    emit CalculationPerformed(msg.sender, "add_two_users");
}`}</pre>
          </div>

          <h5>📝 前端FHE计算调用代码:</h5>
          <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '6px', marginBottom: '10px' }}>
            <pre style={{ margin: 0, fontSize: '12px', overflow: 'auto' }}>{`// FHE计算操作的前端实现

// 加密运算数（除法除外）
const performFHECalculation = async (operation, operand) => {
  let encryptedData = null;

  if (operation !== 'divide') {
    // 创建加密输入
    const input = instance.createEncryptedInput(contractAddress, userAddress)
    input.add32(parseInt(operand))
    const encryptedInput = await input.encrypt()

    encryptedData = {
      handle: encryptedInput.handles[0],
      inputProof: encryptedInput.inputProof
    }
  }

  // 调用对应的合约函数
  switch (operation) {
    case 'add':
      await contract.addToStoredNumber(
        encryptedData.handle,
        encryptedData.inputProof
      )
      break

    case 'subtract':
      await contract.subtractFromStoredNumber(
        encryptedData.handle,
        encryptedData.inputProof
      )
      break

    case 'multiply':
      await contract.multiplyStoredNumber(
        encryptedData.handle,
        encryptedData.inputProof
      )
      break

    case 'divide':
      // 除法运算：除数为明文，不需要加密
      await contract.divideStoredNumber(parseInt(operand))
      break
  }
}

// 获取计算结果
const getCalculationResult = async () => {
  return await contract.getCalculationResult()
}

// 支持的FHE运算类型
const fheOperations = {
  arithmetic: ['add', 'sub', 'mul', 'div', 'rem'],  // 算术运算
  comparison: ['eq', 'ne', 'lt', 'le', 'gt', 'ge'], // 比较运算
  bitwise: ['and', 'or', 'xor', 'not'],             // 位运算
  special: ['min', 'max', 'select']                 // 特殊运算
}`}</pre>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h4>步骤1: 获取你存储的数字</h4>
        <button
          onClick={handleGetStoredNumber}
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
          获取存储的数字
        </button>
        {currentStoredNumber && (
          <span style={{ color: 'green' }}>
            ✅ 当前存储数字: {currentStoredNumber}
          </span>
        )}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h4>步骤2: 选择运算类型</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
          {operations.map((op) => (
            <label
              key={op.value}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '10px',
                border: selectedOperation === op.value ? '2px solid #2196F3' : '1px solid #ddd',
                borderRadius: '4px',
                cursor: 'pointer',
                backgroundColor: selectedOperation === op.value ? '#f0f8ff' : 'white'
              }}
            >
              <input
                type="radio"
                value={op.value}
                checked={selectedOperation === op.value}
                onChange={(e) => setSelectedOperation(e.target.value)}
                style={{ marginRight: '8px' }}
              />
              <div>
                <div style={{ fontWeight: 'bold' }}>{op.label}</div>
                <div style={{ fontSize: '12px', color: '#666' }}>{op.description}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h4>步骤3: 输入操作数</h4>
        {selectedOperation === 'divide' ? (
          <div>
            <input
              type="number"
              value={divisor}
              onChange={(e) => setDivisor(e.target.value)}
              placeholder="输入除数（明文，不加密）"
              style={{
                width: '300px',
                padding: '8px',
                margin: '10px 0',
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
            />
            <p style={{ fontSize: '14px', color: '#666' }}>
              📝 注意：除法运算中，除数必须是明文（不加密），因为FHE不支持密文除密文。
            </p>
          </div>
        ) : (
          <div>
            <input
              type="number"
              value={operationNumber}
              onChange={(e) => setOperationNumber(e.target.value)}
              placeholder="输入要运算的数字"
              style={{
                width: '300px',
                padding: '8px',
                margin: '10px 0',
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
            />
            <p style={{ fontSize: '14px', color: '#666' }}>
              这个数字将被加密后与你的存储数字进行运算
            </p>
          </div>
        )}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={handleCalculation}
          disabled={!instance || isProcessing || !currentStoredNumber}
          style={{
            padding: '12px 24px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          {isProcessing ? '计算中...' : `执行${operations.find(op => op.value === selectedOperation)?.label}`}
        </button>
      </div>

      {calculationResult && (
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f0f8ff', borderRadius: '4px' }}>
          <h4>✅ 计算完成！</h4>
          <p><strong>运算类型:</strong> {operations.find(op => op.value === calculationResult.operation)?.label}</p>
          <p><strong>操作数:</strong> {calculationResult.operand}</p>
          <p><strong>交易哈希:</strong> {calculationResult.txHash}</p>
          <p><strong>结果句柄:</strong></p>
          <code style={{ fontSize: '12px', wordBreak: 'break-all' }}>
            {calculationResult.resultHandle}
          </code>

          <div style={{ marginTop: '15px' }}>
            <button
              onClick={handleDecryptResult}
              style={{
                padding: '8px 16px',
                backgroundColor: '#9C27B0',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              解密查看结果
            </button>
          </div>

          {calculationResult.decryptedResult && (
            <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#e8f5e8', borderRadius: '4px' }}>
              <h5>🎉 解密结果:</h5>
              <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#2E7D32' }}>
                {calculationResult.decryptedResult}
              </p>
            </div>
          )}
        </div>
      )}

      <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        <h5>FHE计算特性：</h5>
        <ul>
          <li><strong>同态运算:</strong> 直接在加密数据上进行计算，无需解密</li>
          <li><strong>隐私保护:</strong> 计算过程中数据始终保持加密状态</li>
          <li><strong>结果加密:</strong> 计算结果也是加密的，需要用户解密查看</li>
          <li><strong>权限控制:</strong> 只有授权用户可以解密计算结果</li>
        </ul>

        <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#fff3cd', borderRadius: '4px' }}>
          <h5>⚡ 运算限制说明：</h5>
          <ul>
            <li><strong>除法运算:</strong> 除数必须是明文，不能是密文</li>
            <li><strong>取余运算:</strong> 与除法类似，模数必须是明文</li>
            <li><strong>Gas消耗:</strong> FHE运算比普通运算消耗更多Gas</li>
            <li><strong>精度限制:</strong> 整数运算，不支持浮点数</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default FHECalculations