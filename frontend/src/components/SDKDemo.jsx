import { useState } from 'react'
import { useFHEVM } from '../hooks/useFHEVM'
import { useAccount } from 'wagmi'

const SDKDemo = () => {
  const { instance, isLoading, error, isInitialized, initFHEVM } = useFHEVM()
  const [installationComplete, setInstallationComplete] = useState(false)
  const { address } = useAccount()

  const handleInstallSDK = () => {
    // 模拟安装过程
    setInstallationComplete(true)
  }

  const handleInitSDK = async () => {
    if (!address) {
      alert('请先连接钱包')
      return
    }
    console.log('开始初始化SDK...')
    const success = await initFHEVM()
    console.log('初始化完成，结果:', success)
    // 注意：这里的状态可能还没有更新，因为React状态更新是异步的
  }

  return (
    <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', margin: '20px 0' }}>
      <h3>步骤1: Zama前端SDK介绍</h3>

      <div style={{ marginBottom: '20px' }}>
        <h4>什么是Zama SDK？</h4>
        <p>Zama SDK是一个JavaScript库，用于在前端应用中与FHEVM（全同态加密虚拟机）进行交互。</p>
        <ul>
          <li>支持数据加密和解密</li>
          <li>与智能合约无缝集成</li>
          <li>保护用户数据隐私</li>
        </ul>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h4>步骤1: 安装SDK</h4>
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
            点击安装SDK
          </button>
        ) : (
          <div style={{ color: 'green', marginBottom: '20px' }}>
            ✅ SDK安装完成！
          </div>
        )}
      </div>

      {installationComplete && (
        <div style={{ marginBottom: '20px' }}>
          <h4>步骤2: 初始化SDK</h4>
          <p style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>
            点击下面按钮来初始化Zama SDK。这将创建FHEVM实例，用于后续的加密操作。
          </p>

          {!address && (
            <div style={{ color: '#ff9800', marginBottom: '10px' }}>
              ⚠️ 请先连接钱包再初始化SDK
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
              {isLoading ? '初始化中...' : '点击初始化SDK'}
            </button>
          ) : (
            <div style={{ color: 'green' }}>
              ✅ SDK初始化完成！
            </div>
          )}

          {error && (
            <div style={{ color: 'red', marginTop: '10px' }}>
              ❌ 初始化失败: {error}
            </div>
          )}
        </div>
      )}

      {instance && isInitialized && (
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e8f5e8', borderRadius: '4px' }}>
          <h4>🎉 FHEVM实例已创建</h4>
          <p>SDK已成功初始化，现在可以进行加密操作了！</p>
          <div style={{ marginTop: '10px' }}>
            <h5>实例配置信息：</h5>
            <ul style={{ fontSize: '12px' }}>
              <li>网络: Sepolia测试网</li>
              <li>链ID: 11155111</li>
              <li>Gateway链ID: 55815</li>
              <li>Relayer服务: 已连接</li>
            </ul>
          </div>
        </div>
      )}

      <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        <h5>接下来你将学习：</h5>
        <ol>
          <li>数字加密存储</li>
          <li>数字解密读取</li>
          <li>地址加密存储</li>
          <li>地址解密读取</li>
          <li>FHE计算操作</li>
        </ol>

        {!isInitialized && (
          <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#fff3cd', borderRadius: '4px' }}>
            <strong>📝 注意:</strong> 请完成SDK初始化后再进行下一步操作。初始化过程会创建与Zama网络的连接，这是进行加密操作的前提条件。
          </div>
        )}
      </div>
    </div>
  )
}

export default SDKDemo