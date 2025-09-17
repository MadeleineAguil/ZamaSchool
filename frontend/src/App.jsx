import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import './App.css'

// 导入组件
import SDKDemo from './components/SDKDemo'
import NumberStorage from './components/NumberStorage'
import NumberDecryption from './components/NumberDecryption'
import AddressStorage from './components/AddressStorage'
import AddressDecryption from './components/AddressDecryption'
import FHECalculations from './components/FHECalculations'

function App() {
  const { address, isConnected } = useAccount()

  return (
    <>
      <header style={{
        padding: '20px',
        textAlign: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        marginBottom: '20px'
      }}>
        <h1>🔐 ZamaSchool - FHE学习平台</h1>
        <p>学习Zama的全同态加密技术，体验隐私保护的区块链计算</p>
      </header>

      <main style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ marginBottom: '30px', textAlign: 'center' }}>
          <h2>连接钱包开始学习</h2>
          <ConnectButton />
          {isConnected && (
            <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#e8f5e8', borderRadius: '8px' }}>
              <p style={{ margin: 0 }}>✅ 钱包已连接: <code>{address}</code></p>
            </div>
          )}
        </div>

        {isConnected ? (
          <div>
            {/* 学习步骤指导 */}
            <div style={{
              marginBottom: '30px',
              padding: '20px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              border: '1px solid #dee2e6'
            }}>
              <h3>🎯 学习路径指导</h3>
              <p>按照以下步骤循序渐进地学习Zama FHE技术：</p>
              <ol style={{ paddingLeft: '20px' }}>
                <li><strong>SDK介绍</strong> - 了解Zama前端SDK的基本概念和配置</li>
                <li><strong>数字加密存储</strong> - 学习如何加密数字并存储到区块链</li>
                <li><strong>数字解密读取</strong> - 掌握从区块链读取和解密数字的方法</li>
                <li><strong>地址加密存储</strong> - 体验以太坊地址的加密存储</li>
                <li><strong>地址解密读取</strong> - 练习地址数据的解密操作</li>
                <li><strong>FHE计算</strong> - 探索同态加密计算的强大功能</li>
              </ol>
            </div>

            {/* 各个学习模块 */}
            <SDKDemo />
            <NumberStorage />
            <NumberDecryption />
            <AddressStorage />
            <AddressDecryption />
            <FHECalculations />

            {/* 学习总结 */}
            <div style={{
              marginTop: '40px',
              padding: '20px',
              backgroundColor: '#e3f2fd',
              borderRadius: '8px',
              border: '1px solid #2196F3'
            }}>
              <h3>🎉 恭喜完成学习！</h3>
              <p>你已经掌握了Zama FHE技术的核心概念：</p>
              <ul>
                <li>✅ 理解了全同态加密的基本原理</li>
                <li>✅ 学会了使用Zama前端SDK</li>
                <li>✅ 掌握了加密数据的存储和读取</li>
                <li>✅ 体验了隐私保护的计算功能</li>
              </ul>

              <div style={{ marginTop: '20px', padding: '15px', backgroundColor: 'white', borderRadius: '4px' }}>
                <h4>🚀 下一步建议：</h4>
                <ul>
                  <li>尝试构建自己的隐私保护DApp</li>
                  <li>深入学习Zama Solidity库的高级功能</li>
                  <li>探索更复杂的FHE算法和应用场景</li>
                  <li>参与Zama社区，分享你的学习心得</li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ marginTop: '30px', textAlign: 'center' }}>
            <div style={{
              padding: '40px',
              backgroundColor: '#fff3cd',
              borderRadius: '8px',
              border: '1px solid #ffeaa7'
            }}>
              <h3>🔗 为什么需要连接钱包？</h3>
              <div style={{ textAlign: 'left', display: 'inline-block', marginTop: '20px' }}>
                <h4>📚 学习体验：</h4>
                <ul>
                  <li>🎮 体验真实的区块链交互过程</li>
                  <li>🔐 学习加密数据的存储和读取操作</li>
                  <li>⚡ 练习使用Zama的FHE功能</li>
                  <li>🌐 理解去中心化应用的工作原理</li>
                </ul>

                <h4>🛡️ 隐私保护特性：</h4>
                <ul>
                  <li>🔒 数据在区块链上完全加密存储</li>
                  <li>👤 只有你可以解密自己的数据</li>
                  <li>🔢 支持加密状态下的数学运算</li>
                  <li>🚫 第三方无法获取你的隐私信息</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer style={{
        marginTop: '50px',
        padding: '20px',
        textAlign: 'center',
        backgroundColor: '#f8f9fa',
        borderTop: '1px solid #dee2e6'
      }}>
        <p style={{ margin: 0, color: '#666' }}>
          Powered by <strong>Zama</strong> | 全同态加密技术学习平台
        </p>
      </footer>
    </>
  )
}

export default App
