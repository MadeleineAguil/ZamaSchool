import React from 'react'

const ZamaIntro = () => {
  return (
    <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', margin: '20px 0' }}>
      <h3>🔐 Zama Technology Introduction</h3>

      {/* What is Zama */}
      <div style={{ marginBottom: '30px', padding: '25px', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #dee2e6' }}>
        <h4 style={{ marginTop: 0, color: '#2196F3' }}>🚀 What is Zama?</h4>
        <p style={{ lineHeight: '1.6', marginBottom: '15px' }}>
          Zama is a pioneering company in Fully Homomorphic Encryption (FHE) technology, dedicated to enabling blockchain applications
          to perform computations directly on encrypted data without decryption, thus achieving true privacy-preserving computation.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
          <div>
            <h5>🎯 Core Technologies:</h5>
            <ul style={{ fontSize: '14px', lineHeight: '1.5' }}>
              <li>Fully Homomorphic Encryption (FHE)</li>
              <li>Zero-Knowledge Proof Integration</li>
              <li>Privacy-Preserving Smart Contracts</li>
              <li>Programmable Encryption</li>
            </ul>
          </div>
          <div>
            <h5>🌟 Application Scenarios:</h5>
            <ul style={{ fontSize: '14px', lineHeight: '1.5' }}>
              <li>Private DeFi Protocols</li>
              <li>Confidential Voting Systems</li>
              <li>Private Auction Platforms</li>
              <li>Protected AI Computation</li>
            </ul>
          </div>
        </div>
      </div>

      {/* FHE Technology Principles */}
      <div style={{ marginBottom: '30px', padding: '25px', backgroundColor: '#e3f2fd', borderRadius: '8px', border: '1px solid #2196F3' }}>
        <h4 style={{ marginTop: 0, color: '#1976D2' }}>🔬 Fully Homomorphic Encryption Principles</h4>
        <div style={{ marginBottom: '20px' }}>
          <h5>Traditional Encryption vs FHE:</h5>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '15px' }}>
            <div style={{ padding: '15px', backgroundColor: '#ffebee', borderRadius: '6px', border: '1px solid #e57373' }}>
              <h6 style={{ margin: '0 0 10px 0', color: '#d32f2f' }}>❌ Traditional Encryption</h6>
              <p style={{ fontSize: '14px', margin: 0, lineHeight: '1.5' }}>
                Data must be decrypted before computation<br/>
                Data exposed during computation<br/>
                Limited privacy protection
              </p>
            </div>
            <div style={{ padding: '15px', backgroundColor: '#e8f5e8', borderRadius: '6px', border: '1px solid #66bb6a' }}>
              <h6 style={{ margin: '0 0 10px 0', color: '#388e3c' }}>✅ FHE Encryption</h6>
              <p style={{ fontSize: '14px', margin: 0, lineHeight: '1.5' }}>
                Compute directly on encrypted data<br/>
                Data remains encrypted at all times<br/>
                Complete privacy protection
              </p>
            </div>
          </div>
        </div>

        <div>
          <h5>FHE Operation Examples:</h5>
          <div style={{ padding: '15px', backgroundColor: 'white', borderRadius: '6px', fontFamily: 'monospace', fontSize: '14px' }}>
            <div style={{ marginBottom: '10px' }}>
              <span style={{ color: '#666' }}>// Traditional approach:</span><br/>
              <span style={{ color: '#1976D2' }}>decrypt(a) + decrypt(b) = result</span>
            </div>
            <div>
              <span style={{ color: '#666' }}>// FHE approach:</span><br/>
              <span style={{ color: '#388e3c' }}>FHE.add(encrypted_a, encrypted_b) = encrypted_result</span>
            </div>
          </div>
        </div>
      </div>

      {/* FHEVM Architecture */}
      <div style={{ marginBottom: '30px', padding: '25px', backgroundColor: '#fff3e0', borderRadius: '8px', border: '1px solid #ff9800' }}>
        <h4 style={{ marginTop: 0, color: '#f57c00' }}>🏗️ FHEVM Architecture Components</h4>
        <p style={{ marginBottom: '20px', lineHeight: '1.6' }}>
          Zama's FHEVM (Fully Homomorphic Encryption Virtual Machine) is a complete privacy-preserving computation ecosystem:
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
          <div style={{ padding: '15px', backgroundColor: 'white', borderRadius: '6px', border: '1px solid #e0e0e0' }}>
            <h6 style={{ margin: '0 0 10px 0', color: '#1976D2' }}>📚 Solidity Library</h6>
            <p style={{ fontSize: '13px', margin: 0, lineHeight: '1.4' }}>
              Provides encrypted data types (euint32, ebool, etc.) and FHE operation functions
            </p>
          </div>

          <div style={{ padding: '15px', backgroundColor: 'white', borderRadius: '6px', border: '1px solid #e0e0e0' }}>
            <h6 style={{ margin: '0 0 10px 0', color: '#1976D2' }}>🔐 KMS Key Management</h6>
            <p style={{ fontSize: '13px', margin: 0, lineHeight: '1.4' }}>
              Distributed key generation and management system ensuring key security
            </p>
          </div>

          <div style={{ padding: '15px', backgroundColor: 'white', borderRadius: '6px', border: '1px solid #e0e0e0' }}>
            <h6 style={{ margin: '0 0 10px 0', color: '#1976D2' }}>⚡ Coprocessor</h6>
            <p style={{ fontSize: '13px', margin: 0, lineHeight: '1.4' }}>
              Specialized processing units for executing FHE computations with optimized performance
            </p>
          </div>

          <div style={{ padding: '15px', backgroundColor: 'white', borderRadius: '6px', border: '1px solid #e0e0e0' }}>
            <h6 style={{ margin: '0 0 10px 0', color: '#1976D2' }}>🌉 Gateway</h6>
            <p style={{ fontSize: '13px', margin: 0, lineHeight: '1.4' }}>
              Coordinates encrypted inputs, access control, and cross-chain bridging
            </p>
          </div>

          <div style={{ padding: '15px', backgroundColor: 'white', borderRadius: '6px', border: '1px solid #e0e0e0' }}>
            <h6 style={{ margin: '0 0 10px 0', color: '#1976D2' }}>🔄 Relayer</h6>
            <p style={{ fontSize: '13px', margin: 0, lineHeight: '1.4' }}>
              Service layer connecting users with FHE infrastructure
            </p>
          </div>

          <div style={{ padding: '15px', backgroundColor: 'white', borderRadius: '6px', border: '1px solid #e0e0e0' }}>
            <h6 style={{ margin: '0 0 10px 0', color: '#1976D2' }}>🔮 Oracle</h6>
            <p style={{ fontSize: '13px', margin: 0, lineHeight: '1.4' }}>
              Handles asynchronous decryption and external data integration
            </p>
          </div>
        </div>
      </div>

      {/* Supported Data Types */}
      <div style={{ marginBottom: '30px', padding: '25px', backgroundColor: '#fce4ec', borderRadius: '8px', border: '1px solid #e91e63' }}>
        <h4 style={{ marginTop: 0, color: '#c2185b' }}>🔢 Supported Encrypted Data Types</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          <div style={{ padding: '12px', backgroundColor: 'white', borderRadius: '6px' }}>
            <strong>ebool</strong> - Encrypted Boolean<br/>
            <span style={{ fontSize: '12px', color: '#666' }}>2-bit encrypted boolean type</span>
          </div>
          <div style={{ padding: '12px', backgroundColor: 'white', borderRadius: '6px' }}>
            <strong>euint8/16/32/64</strong> - Encrypted Integers<br/>
            <span style={{ fontSize: '12px', color: '#666' }}>Unsigned integers of various bit lengths</span>
          </div>
          <div style={{ padding: '12px', backgroundColor: 'white', borderRadius: '6px' }}>
            <strong>eaddress</strong> - Encrypted Address<br/>
            <span style={{ fontSize: '12px', color: '#666' }}>160-bit Ethereum address type</span>
          </div>
          <div style={{ padding: '12px', backgroundColor: 'white', borderRadius: '6px' }}>
            <strong>euint256</strong> - Large Integer<br/>
            <span style={{ fontSize: '12px', color: '#666' }}>256-bit large number type</span>
          </div>
        </div>
      </div>

      {/* FHE Operations */}
      <div style={{ marginBottom: '30px', padding: '25px', backgroundColor: '#f3e5f5', borderRadius: '8px', border: '1px solid #9c27b0' }}>
        <h4 style={{ marginTop: 0, color: '#7b1fa2' }}>⚙️ FHE Operations</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
          <div>
            <h6 style={{ color: '#7b1fa2' }}>🧮 Arithmetic Operations</h6>
            <ul style={{ fontSize: '14px', lineHeight: '1.4' }}>
              <li>FHE.add() - Addition</li>
              <li>FHE.sub() - Subtraction</li>
              <li>FHE.mul() - Multiplication</li>
              <li>FHE.div() - Division</li>
            </ul>
          </div>
          <div>
            <h6 style={{ color: '#7b1fa2' }}>🔍 Comparison Operations</h6>
            <ul style={{ fontSize: '14px', lineHeight: '1.4' }}>
              <li>FHE.eq() - Equal</li>
              <li>FHE.lt() - Less Than</li>
              <li>FHE.gt() - Greater Than</li>
              <li>FHE.le() - Less Than or Equal</li>
            </ul>
          </div>
          <div>
            <h6 style={{ color: '#7b1fa2' }}>🔀 Logical Operations</h6>
            <ul style={{ fontSize: '14px', lineHeight: '1.4' }}>
              <li>FHE.and() - Logical AND</li>
              <li>FHE.or() - Logical OR</li>
              <li>FHE.not() - Logical NOT</li>
              <li>FHE.select() - Conditional Select</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Learning Path */}
      <div style={{ padding: '25px', backgroundColor: '#e8f5e8', borderRadius: '8px', border: '1px solid #4caf50' }}>
        <h4 style={{ marginTop: 0, color: '#388e3c' }}>🎓 Your Learning Journey Ahead</h4>
        <p style={{ marginBottom: '15px', lineHeight: '1.6' }}>
          Through this course, you will gradually master the core concepts and practical applications of Zama FHE technology:
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '15px' }}>
          <div>
            <h6 style={{ color: '#388e3c' }}>🔰 Fundamentals</h6>
            <ul style={{ fontSize: '14px', lineHeight: '1.4' }}>
              <li>SDK configuration and initialization</li>
              <li>Encrypted data storage</li>
              <li>User decryption operations</li>
            </ul>
          </div>
          <div>
            <h6 style={{ color: '#388e3c' }}>🚀 Advanced Topics</h6>
            <ul style={{ fontSize: '14px', lineHeight: '1.4' }}>
              <li>Onchain asynchronous decryption</li>
              <li>FHE computation operations</li>
              <li>Complex application scenarios</li>
            </ul>
          </div>
        </div>
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: 'white', borderRadius: '6px', textAlign: 'center' }}>
          <strong style={{ color: '#388e3c' }}>💡 Ready to start your privacy computation journey?</strong>
        </div>
      </div>
    </div>
  )
}

export default ZamaIntro