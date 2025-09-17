import { useState } from 'react'
import { useFHEVM } from '../hooks/useFHEVM'

const SDKDemo = () => {
  const { instance, isLoading, error } = useFHEVM()
  const [installationComplete, setInstallationComplete] = useState(false)

  const handleInstallSDK = () => {
    // 模拟安装过程
    setInstallationComplete(true)
  }

  if (isLoading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h3>初始化Zama SDK...</h3>
        <p>正在加载FHEVM实例...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
        <h3>SDK初始化失败</h3>
        <p>错误信息: {error}</p>
      </div>
    )
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
        <h4>安装SDK</h4>
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
          <div style={{ color: 'green' }}>
            ✅ SDK安装完成！
          </div>
        )}
      </div>

      {instance && (
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e8f5e8', borderRadius: '4px' }}>
          <h4>✅ FHEVM实例已创建</h4>
          <p>SDK已成功初始化，现在可以进行加密操作了！</p>
          <div style={{ marginTop: '10px' }}>
            <h5>实例配置信息：</h5>
            <ul style={{ fontSize: '12px' }}>
              <li>网络: Sepolia测试网</li>
              <li>Relayer URL: {SepoliaConfig.relayerUrl}</li>
              <li>链ID: {SepoliaConfig.chainId}</li>
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
      </div>
    </div>
  )
}

export default SDKDemo