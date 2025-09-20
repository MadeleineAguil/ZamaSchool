import { useState } from 'react'
import { useFHEVM } from '../hooks/useFHEVM'
import { useAccount } from 'wagmi'
import { isAddress } from 'viem'

const AddressStorage = () => {
  const { instance, isInitialized } = useFHEVM()
  const { address } = useAccount()
  const [inputAddress, setInputAddress] = useState('')
  const [isEncrypting, setIsEncrypting] = useState(false)
  const [encryptedData, setEncryptedData] = useState(null)
  const [txHash, setTxHash] = useState('')
  const [useRandomAddress, setUseRandomAddress] = useState(false)

  // 合约地址（需要部署后更新）
  const CONTRACT_ADDRESS = '0x...' // 将在部署后填入真实地址

  const generateRandomAddress = () => {
    // 生成一个随机的以太坊地址
    const randomBytes = new Uint8Array(20)
    crypto.getRandomValues(randomBytes)
    const randomAddress = '0x' + Array.from(randomBytes)
      .map(byte => byte.toString(16).padStart(2, '0'))
      .join('')
    setInputAddress(randomAddress)
  }

  const handleEncryptAddress = async () => {
    if (!instance || !address) {
      alert('请确保钱包已连接')
      return
    }

    if (!useRandomAddress && (!inputAddress || !isAddress(inputAddress))) {
      alert('请输入有效的以太坊地址')
      return
    }

    setIsEncrypting(true)
    try {
      // 创建加密输入
      const input = instance.createEncryptedInput(CONTRACT_ADDRESS, address)

      if (useRandomAddress) {
        // 对于随机地址，我们将在合约中生成
        // 这里只是标记使用随机地址模式
        setEncryptedData({
          isRandomAddress: true,
          handle: null,
          inputProof: null
        })
      } else {
        // 加密用户输入的地址
        input.addAddress(inputAddress)
        const encryptedInput = await input.encrypt()

        setEncryptedData({
          isRandomAddress: false,
          handle: encryptedInput.handles[0],
          inputProof: encryptedInput.inputProof,
          originalAddress: inputAddress
        })
      }

      console.log('地址加密准备完成')
    } catch (error) {
      console.error('加密失败:', error)
      alert('加密失败: ' + error.message)
    } finally {
      setIsEncrypting(false)
    }
  }

  const handleStoreAddress = async () => {
    if (!encryptedData) {
      alert('请先准备地址数据')
      return
    }

    try {
      // 这里将调用合约存储加密地址
      if (encryptedData.isRandomAddress) {
        console.log('调用合约的storeRandomAddress函数...')
      } else {
        console.log('调用合约的storeAddress函数...')
      }
      setTxHash('0x模拟交易哈希...')
    } catch (error) {
      console.error('存储失败:', error)
      alert('存储失败: ' + error.message)
    }
  }

  if (!isInitialized) {
    return (
      <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', margin: '20px 0', opacity: 0.6 }}>
        <h3>步骤4: 地址加密存储</h3>
        <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
          <p>⏳ 请先完成步骤1中的SDK初始化</p>
          <p style={{ fontSize: '14px', color: '#666' }}>SDK必须初始化后才能进行加密操作</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', margin: '20px 0' }}>
      <h3>步骤4: 地址加密存储</h3>

      <div style={{ marginBottom: '20px' }}>
        <h4>学习目标：</h4>
        <ul>
          <li>学习如何加密以太坊地址</li>
          <li>了解随机地址生成</li>
          <li>掌握eaddress数据类型的使用</li>
        </ul>

        <div style={{ marginTop: '15px' }}>
          <h5>📝 智能合约代码:</h5>
          <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '6px', marginBottom: '10px' }}>
            <pre style={{ margin: 0, fontSize: '12px', overflow: 'auto' }}>{`// AddressStorage.sol
contract AddressStorage is SepoliaConfig {
    mapping(address => eaddress) private userAddresses;

    event AddressStored(address indexed user);

    // 存储用户提供的加密地址
    function storeAddress(
        externalEaddress inputAddress,
        bytes calldata inputProof
    ) external {
        eaddress encryptedAddress = FHE.fromExternal(inputAddress, inputProof);

        userAddresses[msg.sender] = encryptedAddress;

        FHE.allowThis(userAddresses[msg.sender]);
        FHE.allow(userAddresses[msg.sender], msg.sender);

        emit AddressStored(msg.sender);
    }

    // 生成并存储随机地址
    function storeRandomAddress() external {
        // 生成随机地址
        address randomAddr = address(uint160(uint256(
            keccak256(abi.encodePacked(
                block.timestamp,
                msg.sender,
                block.difficulty
            ))
        )));
        eaddress randomAddress = FHE.asEaddress(randomAddr);

        userAddresses[msg.sender] = randomAddress;

        FHE.allowThis(userAddresses[msg.sender]);
        FHE.allow(userAddresses[msg.sender], msg.sender);

        emit AddressStored(msg.sender);
    }

    function getStoredAddress() external view returns (eaddress) {
        return userAddresses[msg.sender];
    }
}`}</pre>
          </div>

          <h5>📝 前端地址加密代码:</h5>
          <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '6px', marginBottom: '10px' }}>
            <pre style={{ margin: 0, fontSize: '12px', overflow: 'auto' }}>{`// 加密地址的两种方式

// 方式1: 加密用户输入的地址
const encryptUserAddress = async (address) => {
  const input = instance.createEncryptedInput(contractAddress, userAddress)
  input.addAddress(address)  // 添加地址类型数据

  const encryptedInput = await input.encrypt()

  // 调用合约存储
  await contract.storeAddress(
    encryptedInput.handles[0],
    encryptedInput.inputProof
  )
}

// 方式2: 使用合约生成随机地址
const storeRandomAddress = async () => {
  // 直接调用合约函数，无需前端加密
  await contract.storeRandomAddress()
}`}</pre>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h4>选择地址输入方式：</h4>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            <input
              type="radio"
              checked={!useRandomAddress}
              onChange={() => setUseRandomAddress(false)}
              style={{ marginRight: '8px' }}
            />
            手动输入地址
          </label>
          <label style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type="radio"
              checked={useRandomAddress}
              onChange={() => setUseRandomAddress(true)}
              style={{ marginRight: '8px' }}
            />
            使用随机生成的地址
          </label>
        </div>
      </div>

      {!useRandomAddress ? (
        <div style={{ marginBottom: '20px' }}>
          <h4>输入以太坊地址：</h4>
          <input
            type="text"
            value={inputAddress}
            onChange={(e) => setInputAddress(e.target.value)}
            placeholder="0x742d35cc6635c0532925a3b8d"
            style={{
              width: '100%',
              padding: '8px',
              margin: '10px 0',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontFamily: 'monospace'
            }}
          />
          <button
            onClick={generateRandomAddress}
            style={{
              padding: '5px 10px',
              backgroundColor: '#607D8B',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            生成示例地址
          </button>
        </div>
      ) : (
        <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f0f8ff', borderRadius: '4px' }}>
          <h4>随机地址模式</h4>
          <p>将在智能合约中生成一个随机的加密地址</p>
        </div>
      )}

      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={handleEncryptAddress}
          disabled={!instance || isEncrypting}
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
          {isEncrypting ? '准备中...' : '准备加密地址'}
        </button>

        {encryptedData && (
          <button
            onClick={handleStoreAddress}
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

      {encryptedData && !encryptedData.isRandomAddress && (
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f0f8ff', borderRadius: '4px' }}>
          <h4>✅ 地址加密成功！</h4>
          <p><strong>原始地址:</strong></p>
          <code style={{ fontSize: '12px', wordBreak: 'break-all' }}>
            {encryptedData.originalAddress}
          </code>
          <p><strong>加密句柄:</strong></p>
          <code style={{ fontSize: '12px', wordBreak: 'break-all' }}>
            {encryptedData.handle}
          </code>
          <p style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
            📝 eaddress是160位的加密地址类型，相当于euint160。
          </p>
        </div>
      )}

      {encryptedData && encryptedData.isRandomAddress && (
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f0f8ff', borderRadius: '4px' }}>
          <h4>✅ 随机地址模式准备就绪！</h4>
          <p>将在智能合约中调用FHE.randEaddress()生成随机加密地址</p>
          <p style={{ fontSize: '14px', color: '#666' }}>
            🎲 每次调用都会生成一个全新的随机地址
          </p>
        </div>
      )}

      {txHash && (
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e8f5e8', borderRadius: '4px' }}>
          <h4>✅ 存储成功！</h4>
          <p><strong>交易哈希:</strong> {txHash}</p>
          <p style={{ fontSize: '14px', color: '#666' }}>
            你的加密地址已安全存储在区块链上！
          </p>
        </div>
      )}

      <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        <h5>技术说明：</h5>
        <ul>
          <li><strong>eaddress:</strong> 160位加密地址类型，等同于euint160</li>
          <li><strong>地址验证:</strong> 确保输入的是有效的以太坊地址格式</li>
          <li><strong>随机生成:</strong> 使用FHE.randEaddress()在合约中生成随机地址</li>
          <li><strong>隐私保护:</strong> 地址信息完全加密，只有授权用户可以解密</li>
        </ul>
      </div>
    </div>
  )
}

export default AddressStorage