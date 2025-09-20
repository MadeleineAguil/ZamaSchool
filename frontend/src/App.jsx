import React, { useState } from 'react'
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

// 导入Context
import { FHEVMProvider } from './contexts/FHEVMContext'

// 章节配置
const chapters = [
  {
    id: 'intro',
    title: '🏠 课程介绍',
    icon: '🏠',
    component: null
  },
  {
    id: 'sdk',
    title: '📦 SDK介绍',
    icon: '📦',
    component: SDKDemo
  },
  {
    id: 'number-storage',
    title: '🔢 数字加密存储',
    icon: '🔢',
    component: NumberStorage
  },
  {
    id: 'number-decrypt',
    title: '🔓 数字解密读取',
    icon: '🔓',
    component: NumberDecryption
  },
  {
    id: 'address-storage',
    title: '📧 地址加密存储',
    icon: '📧',
    component: AddressStorage
  },
  {
    id: 'address-decrypt',
    title: '🔍 地址解密读取',
    icon: '🔍',
    component: AddressDecryption
  },
  {
    id: 'calculations',
    title: '🧮 FHE计算',
    icon: '🧮',
    component: FHECalculations
  },
  {
    id: 'conclusion',
    title: '🎉 学习总结',
    icon: '🎉',
    component: null
  }
]

function App() {
  const { address, isConnected } = useAccount()
  const [currentChapter, setCurrentChapter] = useState('intro')

  // 渲染侧边栏
  const renderSidebar = () => (
    <div style={{
      width: '280px',
      minHeight: '100vh',
      backgroundColor: '#f8f9fa',
      borderRight: '1px solid #dee2e6',
      padding: '20px 0',
      position: 'fixed',
      top: '0',
      left: '0',
      overflowY: 'auto'
    }}>
      <div style={{ padding: '0 20px', marginBottom: '30px' }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>📚 学习目录</h3>
        <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
          点击章节开始学习
        </p>
      </div>

      <nav>
        {chapters.map((chapter, index) => (
          <div
            key={chapter.id}
            onClick={() => setCurrentChapter(chapter.id)}
            style={{
              padding: '12px 20px',
              cursor: 'pointer',
              backgroundColor: currentChapter === chapter.id ? '#e3f2fd' : 'transparent',
              borderLeft: currentChapter === chapter.id ? '4px solid #2196F3' : '4px solid transparent',
              transition: 'all 0.2s ease',
              ':hover': {
                backgroundColor: '#f0f0f0'
              }
            }}
            onMouseEnter={(e) => {
              if (currentChapter !== chapter.id) {
                e.target.style.backgroundColor = '#f0f0f0'
              }
            }}
            onMouseLeave={(e) => {
              if (currentChapter !== chapter.id) {
                e.target.style.backgroundColor = 'transparent'
              }
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '14px', fontWeight: '500', color: '#999' }}>
                {String(index + 1).padStart(2, '0')}
              </span>
              <span style={{ fontSize: '20px' }}>{chapter.icon}</span>
              <span style={{
                fontSize: '14px',
                fontWeight: currentChapter === chapter.id ? '600' : '400',
                color: currentChapter === chapter.id ? '#2196F3' : '#333'
              }}>
                {chapter.title.replace(/^[🏠📦🔢🔓📧🔍🧮🎉]\s*/, '')}
              </span>
            </div>
          </div>
        ))}
      </nav>

      {/* 进度指示器 */}
      <div style={{ padding: '20px', marginTop: '30px' }}>
        <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
          学习进度
        </div>
        <div style={{
          height: '6px',
          backgroundColor: '#e0e0e0',
          borderRadius: '3px',
          overflow: 'hidden'
        }}>
          <div style={{
            height: '100%',
            backgroundColor: '#4CAF50',
            width: `${((chapters.findIndex(ch => ch.id === currentChapter) + 1) / chapters.length) * 100}%`,
            transition: 'width 0.3s ease'
          }} />
        </div>
        <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
          {chapters.findIndex(ch => ch.id === currentChapter) + 1} / {chapters.length}
        </div>
      </div>
    </div>
  )

  // 渲染主要内容
  const renderMainContent = () => {
    const chapter = chapters.find(ch => ch.id === currentChapter)

    if (!chapter) return null

    return (
      <div style={{ marginLeft: '280px', minHeight: '100vh' }}>
        {/* 头部 */}
        <header style={{
          padding: '20px 40px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white'
        }}>
          <h1 style={{ margin: '0 0 10px 0' }}>🔐 ZamaSchool - FHE学习平台</h1>
          <p style={{ margin: 0, opacity: 0.9 }}>学习Zama的全同态加密技术，体验隐私保护的区块链计算</p>
        </header>

        {/* 主要内容区域 */}
        <main style={{ padding: '40px' }}>
          {/* 当前章节标题 */}
          <div style={{ marginBottom: '30px' }}>
            <h2 style={{ margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '28px' }}>{chapter.icon}</span>
              {chapter.title.replace(/^[🏠📦🔢🔓📧🔍🧮🎉]\s*/, '')}
            </h2>
            <div style={{ height: '3px', width: '60px', backgroundColor: '#2196F3', borderRadius: '2px' }} />
          </div>

          {/* 钱包连接区域 */}
          {(currentChapter !== 'intro' && currentChapter !== 'conclusion') && (
            <div style={{ marginBottom: '30px', textAlign: 'center' }}>
              <ConnectButton />
              {isConnected && (
                <div style={{ marginTop: '15px', padding: '12px', backgroundColor: '#e8f5e8', borderRadius: '8px' }}>
                  <p style={{ margin: 0, fontSize: '14px' }}>✅ 钱包已连接: <code>{address}</code></p>
                </div>
              )}
            </div>
          )}

          {/* 章节内容 */}
          {currentChapter === 'intro' && renderIntroContent()}
          {currentChapter === 'conclusion' && renderConclusionContent()}
          {chapter.component && isConnected && React.createElement(chapter.component)}
          {chapter.component && !isConnected && renderWalletRequired()}
        </main>

        {/* 导航按钮 */}
        <div style={{
          padding: '20px 40px',
          borderTop: '1px solid #eee',
          display: 'flex',
          justifyContent: 'space-between'
        }}>
          {renderNavigationButton('prev')}
          {renderNavigationButton('next')}
        </div>

        {/* 页脚 */}
        <footer style={{
          padding: '20px',
          textAlign: 'center',
          backgroundColor: '#f8f9fa',
          borderTop: '1px solid #dee2e6'
        }}>
          <p style={{ margin: 0, color: '#666' }}>
            Powered by <strong>Zama</strong> | 全同态加密技术学习平台
          </p>
        </footer>
      </div>
    )
  }

  // 渲染课程介绍内容
  const renderIntroContent = () => (
    <div>
      <div style={{
        padding: '30px',
        backgroundColor: '#f8f9fa',
        borderRadius: '12px',
        border: '1px solid #dee2e6',
        marginBottom: '30px'
      }}>
        <h3 style={{ marginTop: 0 }}>🎯 学习路径指导</h3>
        <p>欢迎来到ZamaSchool！这是一个专为学习Zama全同态加密技术设计的交互式平台。按照以下步骤循序渐进地学习：</p>

        <div style={{ display: 'grid', gap: '15px', marginTop: '25px' }}>
          {chapters.slice(1, -1).map((chapter, index) => (
            <div key={chapter.id} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
              padding: '15px',
              backgroundColor: 'white',
              borderRadius: '8px',
              border: '1px solid #e0e0e0'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: '#2196F3',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '14px'
              }}>
                {index + 1}
              </div>
              <span style={{ fontSize: '20px' }}>{chapter.icon}</span>
              <div>
                <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                  {chapter.title.replace(/^[📦🔢🔓📧🔍🧮]\s*/, '')}
                </div>
                <div style={{ fontSize: '14px', color: '#666' }}>
                  {getChapterDescription(chapter.id)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{
        padding: '25px',
        backgroundColor: '#fff3cd',
        borderRadius: '8px',
        border: '1px solid #ffeaa7'
      }}>
        <h4>🔗 开始学习前的准备</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '15px' }}>
          <div>
            <h5>📚 学习体验：</h5>
            <ul style={{ fontSize: '14px' }}>
              <li>🎮 体验真实的区块链交互过程</li>
              <li>🔐 学习加密数据的存储和读取操作</li>
              <li>⚡ 练习使用Zama的FHE功能</li>
              <li>🌐 理解去中心化应用的工作原理</li>
            </ul>
          </div>
          <div>
            <h5>🛡️ 隐私保护特性：</h5>
            <ul style={{ fontSize: '14px' }}>
              <li>🔒 数据在区块链上完全加密存储</li>
              <li>👤 只有你可以解密自己的数据</li>
              <li>🔢 支持加密状态下的数学运算</li>
              <li>🚫 第三方无法获取你的隐私信息</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )

  // 渲染学习总结内容
  const renderConclusionContent = () => (
    <div style={{
      padding: '30px',
      backgroundColor: '#e3f2fd',
      borderRadius: '12px',
      border: '1px solid #2196F3'
    }}>
      <h3 style={{ marginTop: 0 }}>🎉 恭喜完成学习！</h3>
      <p>你已经掌握了Zama FHE技术的核心概念：</p>
      <ul>
        <li>✅ 理解了全同态加密的基本原理</li>
        <li>✅ 学会了使用Zama前端SDK</li>
        <li>✅ 掌握了加密数据的存储和读取</li>
        <li>✅ 体验了隐私保护的计算功能</li>
      </ul>

      <div style={{ marginTop: '25px', padding: '20px', backgroundColor: 'white', borderRadius: '8px' }}>
        <h4>🚀 下一步建议：</h4>
        <ul>
          <li>尝试构建自己的隐私保护DApp</li>
          <li>深入学习Zama Solidity库的高级功能</li>
          <li>探索更复杂的FHE算法和应用场景</li>
          <li>参与Zama社区，分享你的学习心得</li>
        </ul>
      </div>
    </div>
  )

  // 渲染需要连接钱包的提示
  const renderWalletRequired = () => (
    <div style={{
      padding: '40px',
      backgroundColor: '#fff3cd',
      borderRadius: '8px',
      border: '1px solid #ffeaa7',
      textAlign: 'center'
    }}>
      <h3>🔗 需要连接钱包</h3>
      <p>请先连接钱包以继续学习这个章节的内容。</p>
      <div style={{ marginTop: '20px' }}>
        <ConnectButton />
      </div>
    </div>
  )

  // 渲染导航按钮
  const renderNavigationButton = (direction) => {
    const currentIndex = chapters.findIndex(ch => ch.id === currentChapter)
    const targetIndex = direction === 'prev' ? currentIndex - 1 : currentIndex + 1
    const targetChapter = chapters[targetIndex]

    if (!targetChapter) return <div />

    return (
      <button
        onClick={() => setCurrentChapter(targetChapter.id)}
        style={{
          padding: '12px 24px',
          backgroundColor: '#2196F3',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '14px',
          fontWeight: '500'
        }}
      >
        {direction === 'prev' && '← 上一章'}
        {direction === 'next' && '下一章 →'}
        <span style={{ fontSize: '16px' }}>{targetChapter.icon}</span>
      </button>
    )
  }

  // 获取章节描述
  const getChapterDescription = (chapterId) => {
    const descriptions = {
      'sdk': '了解Zama前端SDK的基本概念和配置',
      'number-storage': '学习如何加密数字并存储到区块链',
      'number-decrypt': '掌握从区块链读取和解密数字的方法',
      'address-storage': '体验以太坊地址的加密存储',
      'address-decrypt': '练习地址数据的解密操作',
      'calculations': '探索同态加密计算的强大功能'
    }
    return descriptions[chapterId] || ''
  }

  return (
    <FHEVMProvider>
      <div style={{ fontFamily: 'Arial, sans-serif' }}>
        {renderSidebar()}
        {renderMainContent()}
      </div>
    </FHEVMProvider>
  )
}

export default App
