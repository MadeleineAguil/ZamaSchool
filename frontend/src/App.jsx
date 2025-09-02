import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount, useDisconnect } from 'wagmi'
import './App.css'

function App() {
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()

  return (
    <>
      <header style={{ padding: '20px', textAlign: 'center' }}>
        <h1>ZamaSchool - FHE学习平台</h1>
        <p>学习Zama的全同态加密技术</p>
      </header>
      
      <main style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ marginBottom: '30px', textAlign: 'center' }}>
          <h2>连接钱包开始学习</h2>
          <ConnectButton />
        </div>

        {isConnected && (
          <div style={{ marginTop: '30px' }}>
            <h3>钱包已连接</h3>
            <p>地址: {address}</p>
            <div style={{ marginTop: '20px' }}>
              <h4>接下来你可以：</h4>
              <ol>
                <li>了解Zama前端SDK</li>
                <li>学习加密数字存储</li>
                <li>练习解密操作</li>
                <li>体验加密地址处理</li>
                <li>使用FHE计算功能</li>
              </ol>
            </div>
          </div>
        )}

        {!isConnected && (
          <div style={{ marginTop: '30px', textAlign: 'center' }}>
            <h3>为什么需要连接钱包？</h3>
            <ul style={{ textAlign: 'left', display: 'inline-block' }}>
              <li>体验真实的区块链交互</li>
              <li>学习加密数据的存储和读取</li>
              <li>练习使用Zama的FHE功能</li>
              <li>理解去中心化应用的工作原理</li>
            </ul>
          </div>
        )}
      </main>
    </>
  )
}

export default App
