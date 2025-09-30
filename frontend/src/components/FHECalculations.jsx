import { useState } from 'react'
import { useFHEVM } from '../hooks/useFHEVM'
import { useAccount, useWalletClient } from 'wagmi'
import { getContractAddress } from '../config/contracts'
import { useI18n } from '../contexts/I18nContext'

const FHECalculations = () => {
  const { instance, isInitialized } = useFHEVM()
  const { address, chainId } = useAccount()
  const { data: walletClient } = useWalletClient()
  const { t } = useI18n()
  const [operationNumber, setOperationNumber] = useState('')
  const [divisor, setDivisor] = useState('')
  const [selectedOperation, setSelectedOperation] = useState('add')
  const [isProcessing, setIsProcessing] = useState(false)
  const [calculationResult, setCalculationResult] = useState(null)
  const [currentStoredNumber, setCurrentStoredNumber] = useState(null)

  // 合约地址
  const CONTRACT_ADDRESS = getContractAddress('NumberStorage', chainId)

  const operations = [
    { value: 'add', label: t('fhe_calc.op.add.label'), description: t('fhe_calc.op.add.desc') },
    { value: 'subtract', label: t('fhe_calc.op.subtract.label'), description: t('fhe_calc.op.subtract.desc') },
    { value: 'multiply', label: t('fhe_calc.op.multiply.label'), description: t('fhe_calc.op.multiply.desc') },
    { value: 'divide', label: t('fhe_calc.op.divide.label'), description: t('fhe_calc.op.divide.desc') }
  ]

  const handleGetStoredNumber = async () => {
    try {
      // 模拟从合约获取存储的数字
      setCurrentStoredNumber('42') // 模拟值
      console.log('Fetched stored number')
    } catch (error) {
      console.error('Fetch failed:', error)
      alert(t('fhe_calc.fetch_failed') + ' ' + error.message)
    }
  }

  const handleCalculation = async () => {
    if (!instance || !address) {
      alert(t('common.connect_wallet'))
      return
    }

    if (selectedOperation === 'divide') {
      if (!divisor || parseInt(divisor) <= 0) {
        alert(t('fhe_calc.invalid_divisor'))
        return
      }
    } else {
      if (!operationNumber) {
        alert(t('fhe_calc.enter_operand'))
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

      console.log(`Call contract: ${functionName}`, params)

      // 模拟交易结果
      setCalculationResult({
        operation: selectedOperation,
        operand: selectedOperation === 'divide' ? divisor : operationNumber,
        txHash: '0xMOCK_CALC_TX_HASH...',
        resultHandle: '0x830a61b343d2f3de67ec59cb18961fd086085c1c73ff0000000000aa36a70800'
      })

    } catch (error) {
      console.error('Calculation failed:', error)
      alert(t('fhe_calc.calc_failed') + ' ' + error.message)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDecryptResult = async () => {
    if (!calculationResult || !walletClient) {
      alert(t('fhe_calc.no_result_or_wallet'))
      return
    }

    try {
      // 模拟解密过程（实际实现参考NumberDecryption组件）
      console.log('Decrypt calculation result...')

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
      console.error('Decrypt failed:', error)
      alert(t('fhe_calc.decrypt_failed') + ' ' + error.message)
    }
  }

  if (!isInitialized) {
    return (
      <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', margin: '20px 0', opacity: 0.6 }}>
        <h3>{t('fhe_calc.section_title')}</h3>
        <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
          <p>⏳ {t('common.init_sdk_first')}</p>
          <p style={{ fontSize: '14px', color: '#666' }}>{t('fhe_calc.sdk_required_for_calc')}</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', margin: '20px 0' }}>
      <h3>{t('fhe_calc.section_title')}</h3>

      <div style={{ marginBottom: '20px' }}>
        <h4>{t('common.learning_objectives')}</h4>
        <ul>
          <li>{t('fhe_calc.goal_1')}</li>
          <li>{t('fhe_calc.goal_2')}</li>
          <li>{t('fhe_calc.goal_3')}</li>
        </ul>

        <div style={{ marginTop: '15px' }}>
          <h5>📝 {t('fhe_calc.contract_code')}</h5>
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

          <h5>📝 {t('fhe_calc.frontend_code')}</h5>
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
        <h4>{t('fhe_calc.step1_title')}</h4>
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
          {t('fhe_calc.get_stored_number')}
        </button>
        {currentStoredNumber && (
          <span style={{ color: 'green' }}>
            ✅ {t('fhe_calc.current_stored')}: {currentStoredNumber}
          </span>
        )}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h4>{t('fhe_calc.step2_title')}</h4>
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
        <h4>{t('fhe_calc.step3_title')}</h4>
        {selectedOperation === 'divide' ? (
          <div>
            <input
              type="number"
              value={divisor}
              onChange={(e) => setDivisor(e.target.value)}
              placeholder={t('fhe_calc.input_divisor_placeholder')}
              style={{
                width: '300px',
                padding: '8px',
                margin: '10px 0',
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
            />
            <p style={{ fontSize: '14px', color: '#666' }}>
              📝 {t('fhe_calc.divide_note')}
            </p>
          </div>
        ) : (
          <div>
            <input
              type="number"
              value={operationNumber}
              onChange={(e) => setOperationNumber(e.target.value)}
              placeholder={t('fhe_calc.input_operand_placeholder')}
              style={{
                width: '300px',
                padding: '8px',
                margin: '10px 0',
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
            />
            <p style={{ fontSize: '14px', color: '#666' }}>
              {t('fhe_calc.encrypt_operand_note')}
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
          {isProcessing ? t('fhe_calc.processing') : `${t('fhe_calc.execute')} ${operations.find(op => op.value === selectedOperation)?.label}`}
        </button>
      </div>

      {calculationResult && (
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f0f8ff', borderRadius: '4px' }}>
          <h4>✅ {t('fhe_calc.calc_done')}</h4>
          <p><strong>{t('fhe_calc.op_type')}:</strong> {operations.find(op => op.value === calculationResult.operation)?.label}</p>
          <p><strong>{t('fhe_calc.operand')}:</strong> {calculationResult.operand}</p>
          <p><strong>{t('common.tx_hash')}:</strong> {calculationResult.txHash}</p>
          <p><strong>{t('fhe_calc.result_handle')}:</strong></p>
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
              {t('fhe_calc.decrypt_to_view')}
            </button>
          </div>

          {calculationResult.decryptedResult && (
            <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#e8f5e8', borderRadius: '4px' }}>
              <h5>🎉 {t('fhe_calc.decrypted_result')}:</h5>
              <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#2E7D32' }}>
                {calculationResult.decryptedResult}
              </p>
            </div>
          )}
        </div>
      )}

      <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        <h5>{t('fhe_calc.features_title')}</h5>
        <ul>
          <li><strong>{t('fhe_calc.homomorphic')}:</strong> {t('fhe_calc.homomorphic_desc')}</li>
          <li><strong>{t('fhe_calc.privacy')}:</strong> {t('fhe_calc.privacy_desc')}</li>
          <li><strong>{t('fhe_calc.result_encrypted')}:</strong> {t('fhe_calc.result_encrypted_desc')}</li>
          <li><strong>{t('fhe_calc.acl')}:</strong> {t('fhe_calc.acl_desc')}</li>
        </ul>

        <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#fff3cd', borderRadius: '4px' }}>
          <h5>⚡ {t('fhe_calc.limits_title')}:</h5>
          <ul>
            <li><strong>{t('fhe_calc.divide')}:</strong> {t('fhe_calc.divide_desc')}</li>
            <li><strong>{t('fhe_calc.mod')}:</strong> {t('fhe_calc.mod_desc')}</li>
            <li><strong>{t('fhe_calc.gas')}:</strong> {t('fhe_calc.gas_desc')}</li>
            <li><strong>{t('fhe_calc.precision')}:</strong> {t('fhe_calc.precision_desc')}</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default FHECalculations
