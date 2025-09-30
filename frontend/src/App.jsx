import React, { useState } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import './App.css'

// Import components
import ZamaIntro from './components/ZamaIntro'
import SDKDemo from './components/SDKDemo'
import NumberStorage from './components/NumberStorage'
import NumberDecryption from './components/NumberDecryption'
import AddressStorage from './components/AddressStorage'
import AddressDecryption from './components/AddressDecryption'
import OnchainDecryption from './components/OnchainDecryption'
import FHECalculations from './components/FHECalculations'
import NumberComparison from './components/NumberComparison'

// Import Context
import { FHEVMProvider } from './contexts/FHEVMContext'

// Chapter configuration
const chapters = [
  {
    id: 'intro',
    title: 'Course Introduction',
    icon: '🏠',
    fallbackIcon: '■',
    component: null
  },
  {
    id: 'zama-intro',
    title: 'Zama Technology Introduction',
    icon: '🔐',
    fallbackIcon: '♦',
    component: ZamaIntro
  },
  {
    id: 'sdk',
    title: 'SDK Introduction',
    icon: '📦',
    fallbackIcon: '▲',
    component: SDKDemo
  },
  {
    id: 'number-storage',
    title: 'Encrypted Number Storage',
    icon: '🔢',
    fallbackIcon: '●',
    component: NumberStorage
  },
  {
    id: 'number-decrypt',
    title: 'Number Decryption',
    icon: '🔓',
    fallbackIcon: '◆',
    component: NumberDecryption
  },
  {
    id: 'address-storage',
    title: 'Encrypted Address Storage',
    icon: '📧',
    fallbackIcon: '▼',
    component: AddressStorage
  },
  {
    id: 'address-decrypt',
    title: 'Address Decryption',
    icon: '🔍',
    fallbackIcon: '◉',
    component: AddressDecryption
  },
  {
    id: 'onchain-decrypt',
    title: 'Onchain Decryption Request',
    icon: '⚡',
    fallbackIcon: '⚡',
    component: OnchainDecryption
  },
  {
    id: 'calculations',
    title: 'FHE Encrypted Calculations',
    icon: '🧮',
    fallbackIcon: '★',
    component: FHECalculations
  },
  {
    id: 'number-comparison',
    title: 'Encrypted Number Comparison',
    icon: '⚖️',
    fallbackIcon: '⚖',
    component: NumberComparison
  },
  {
    id: 'conclusion',
    title: 'Learning Summary',
    icon: '🎉',
    fallbackIcon: '✓',
    component: null
  }
]

function App() {
  const { address, isConnected } = useAccount()
  const [currentChapter, setCurrentChapter] = useState('intro')

  // Render chapter icon
  const renderChapterIcon = (chapter, size = '20px') => {
    return (
      <span
        className="chapter-icon emoji-support"
        style={{
          fontSize: size,
          display: 'inline-block',
          minWidth: size,
          textAlign: 'center',
          fontFamily: '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", "Android Emoji", "EmojiSymbols", sans-serif'
        }}
      >
        {chapter.icon}
      </span>
    )
  }

  // Render sidebar
  const renderSidebar = () => (
    <div style={{
      width: '280px',
      height: '100vh',
      backgroundColor: '#f8f9fa',
      borderRight: '1px solid #dee2e6',
      padding: '20px 0',
      position: 'fixed',
      top: '0',
      left: '0',
      overflowY: 'auto',
      boxSizing: 'border-box'
    }}>
      <div style={{ padding: '0 20px', marginBottom: '30px' }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>📚 Zama Learning Catalog</h3>
        <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
          Click chapter to start learning
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
              {renderChapterIcon(chapter, '20px')}
              <span style={{
                fontSize: '14px',
                fontWeight: currentChapter === chapter.id ? '600' : '400',
                color: currentChapter === chapter.id ? '#2196F3' : '#333'
              }}>
                {chapter.title}
              </span>
            </div>
          </div>
        ))}
      </nav>

      {/* Progress indicator */}
      <div style={{ padding: '20px', marginTop: '30px' }}>
        <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
          Learning Progress
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

  // Render main content
  const renderMainContent = () => {
    const chapter = chapters.find(ch => ch.id === currentChapter)

    if (!chapter) return null

    return (
      <div style={{ marginLeft: '280px', minHeight: '100vh' }}>
        {/* Header */}
        <header style={{
          padding: '20px 40px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white'
        }}>
          <h1 style={{ margin: '0 0 10px 0' }}>🔐 ZamaSchool - FHE Learning Platform</h1>
          <p style={{ margin: 0, opacity: 0.9 }}>Learn Zama's Fully Homomorphic Encryption technology and experience privacy-preserving blockchain computing</p>
        </header>

        {/* Main content area */}
        <main style={{ padding: '40px' }}>
          {/* Current chapter title */}
          <div style={{ marginBottom: '30px' }}>
            <h2 style={{ margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '12px' }}>
              {renderChapterIcon(chapter, '28px')}
              {chapter.title}
            </h2>
            <div style={{ height: '3px', width: '60px', backgroundColor: '#2196F3', borderRadius: '2px' }} />
          </div>

          {/* Wallet connection area */}
          {(currentChapter !== 'intro' && currentChapter !== 'conclusion') && (
            <div style={{ marginBottom: '30px', textAlign: 'center' }}>
              <ConnectButton />
              {isConnected && (
                <div style={{ marginTop: '15px', padding: '12px', backgroundColor: '#e8f5e8', borderRadius: '8px' }}>
                  <p style={{ margin: 0, fontSize: '14px' }}>✅ Wallet Connected: <code>{address}</code></p>
                </div>
              )}
            </div>
          )}

          {/* Chapter content */}
          {currentChapter === 'intro' && renderIntroContent()}
          {currentChapter === 'conclusion' && renderConclusionContent()}
          {chapter.component && isConnected && React.createElement(chapter.component)}
          {chapter.component && !isConnected && renderWalletRequired()}
        </main>

        {/* Navigation buttons */}
        <div style={{
          padding: '20px 40px',
          borderTop: '1px solid #eee',
          display: 'flex',
          justifyContent: 'space-between'
        }}>
          {renderNavigationButton('prev')}
          {renderNavigationButton('next')}
        </div>

        {/* Footer */}
        <footer style={{
          padding: '20px',
          textAlign: 'center',
          backgroundColor: '#f8f9fa',
          borderTop: '1px solid #dee2e6'
        }}>
          <p style={{ margin: 0, color: '#666' }}>
            Powered by <strong>Zama</strong> | Fully Homomorphic Encryption Learning Platform
          </p>
        </footer>
      </div>
    )
  }

  // Render course introduction content
  const renderIntroContent = () => (
    <div>
      <div style={{
        padding: '30px',
        backgroundColor: '#f8f9fa',
        borderRadius: '12px',
        border: '1px solid #dee2e6',
        marginBottom: '30px'
      }}>
        <h3 style={{ marginTop: 0 }}>🎯 Learning Path Guide</h3>
        <p>Welcome to ZamaSchool! This is an interactive platform designed specifically for learning Zama's Fully Homomorphic Encryption technology. Follow these steps to learn progressively:</p>

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
              {renderChapterIcon(chapter, '20px')}
              <div>
                <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                  {chapter.title}
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
        <h4>🔗 Preparation Before Learning</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '15px' }}>
          <div>
            <h5>📚 Learning Experience:</h5>
            <ul style={{ fontSize: '14px' }}>
              <li>🎮 Experience real blockchain interaction processes</li>
              <li>🔐 Learn encrypted data storage and reading operations</li>
              <li>⚡ Practice using Zama's FHE capabilities</li>
              <li>🌐 Understand how decentralized applications work</li>
            </ul>
          </div>
          <div>
            <h5>🛡️ Privacy Protection Features:</h5>
            <ul style={{ fontSize: '14px' }}>
              <li>🔒 Data is fully encrypted on the blockchain</li>
              <li>👤 Only you can decrypt your own data</li>
              <li>🔢 Supports mathematical operations on encrypted data</li>
              <li>🚫 Third parties cannot access your private information</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )

  // Render learning summary content
  const renderConclusionContent = () => (
    <div style={{
      padding: '30px',
      backgroundColor: '#e3f2fd',
      borderRadius: '12px',
      border: '1px solid #2196F3'
    }}>
      <h3 style={{ marginTop: 0 }}>🎉 Congratulations on Completing the Course!</h3>
      <p>You have mastered the core concepts of Zama FHE technology:</p>
      <ul>
        <li>✅ Understood the basic principles of Fully Homomorphic Encryption</li>
        <li>✅ Learned to use the Zama frontend SDK</li>
        <li>✅ Mastered encrypted data storage and retrieval</li>
        <li>✅ Experienced privacy-preserving computation capabilities</li>
      </ul>

      <div style={{ marginTop: '25px', padding: '20px', backgroundColor: 'white', borderRadius: '8px' }}>
        <h4>🚀 Next Steps:</h4>
        <ul>
          <li>Try building your own privacy-preserving DApp</li>
          <li>Deep dive into advanced features of Zama's Solidity library</li>
          <li>Explore more complex FHE algorithms and application scenarios</li>
          <li>Join the Zama community and share your learning experience</li>
        </ul>
      </div>
    </div>
  )

  // Render wallet connection required prompt
  const renderWalletRequired = () => (
    <div style={{
      padding: '40px',
      backgroundColor: '#fff3cd',
      borderRadius: '8px',
      border: '1px solid #ffeaa7',
      textAlign: 'center'
    }}>
      <h3>🔗 Wallet Connection Required</h3>
      <p>Please connect your wallet to continue learning this chapter's content.</p>
      <div style={{ marginTop: '20px' }}>
        <ConnectButton />
      </div>
    </div>
  )

  // Render navigation buttons
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
        {direction === 'prev' && '← Previous'}
        {direction === 'next' && 'Next →'}
        <span style={{ fontSize: '16px' }}>{targetChapter.icon}</span>
      </button>
    )
  }

  // Get chapter description
  const getChapterDescription = (chapterId) => {
    const descriptions = {
      'zama-intro': 'Deep dive into Zama FHE technology principles and architecture',
      'sdk': 'Understand basic concepts and configuration of Zama frontend SDK',
      'number-storage': 'Learn how to encrypt numbers and store them on blockchain',
      'number-decrypt': 'Master methods for reading and decrypting numbers from blockchain',
      'address-storage': 'Experience encrypted storage of Ethereum addresses',
      'address-decrypt': 'Practice address data decryption operations',
      'onchain-decrypt': 'Learn requestDecryption for onchain asynchronous decryption',
      'calculations': 'Explore the powerful capabilities of homomorphic encrypted computation',
      'number-comparison': 'Learn encrypted number comparison operations and conditional logic'
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
