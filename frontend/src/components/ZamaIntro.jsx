import React from 'react'

const ZamaIntro = () => {
  return (
    <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', margin: '20px 0' }}>
      <h3>🔐 Zama技术介绍</h3>

      {/* 什么是Zama */}
      <div style={{ marginBottom: '30px', padding: '25px', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #dee2e6' }}>
        <h4 style={{ marginTop: 0, color: '#2196F3' }}>🚀 什么是Zama？</h4>
        <p style={{ lineHeight: '1.6', marginBottom: '15px' }}>
          Zama是全同态加密(FHE - Fully Homomorphic Encryption)技术的先驱企业，致力于让区块链应用能够在加密数据上直接进行计算，
          而无需解密数据，从而实现真正的隐私保护计算。
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
          <div>
            <h5>🎯 核心技术：</h5>
            <ul style={{ fontSize: '14px', lineHeight: '1.5' }}>
              <li>全同态加密 (FHE)</li>
              <li>零知识证明集成</li>
              <li>隐私保护智能合约</li>
              <li>可编程加密</li>
            </ul>
          </div>
          <div>
            <h5>🌟 应用场景：</h5>
            <ul style={{ fontSize: '14px', lineHeight: '1.5' }}>
              <li>隐私DeFi协议</li>
              <li>机密投票系统</li>
              <li>私有拍卖平台</li>
              <li>保护性AI计算</li>
            </ul>
          </div>
        </div>
      </div>

      {/* FHE技术原理 */}
      <div style={{ marginBottom: '30px', padding: '25px', backgroundColor: '#e3f2fd', borderRadius: '8px', border: '1px solid #2196F3' }}>
        <h4 style={{ marginTop: 0, color: '#1976D2' }}>🔬 全同态加密技术原理</h4>
        <div style={{ marginBottom: '20px' }}>
          <h5>传统加密 vs FHE:</h5>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '15px' }}>
            <div style={{ padding: '15px', backgroundColor: '#ffebee', borderRadius: '6px', border: '1px solid #e57373' }}>
              <h6 style={{ margin: '0 0 10px 0', color: '#d32f2f' }}>❌ 传统加密</h6>
              <p style={{ fontSize: '14px', margin: 0, lineHeight: '1.5' }}>
                数据必须先解密才能计算<br/>
                计算过程中数据暴露<br/>
                隐私保护有限
              </p>
            </div>
            <div style={{ padding: '15px', backgroundColor: '#e8f5e8', borderRadius: '6px', border: '1px solid #66bb6a' }}>
              <h6 style={{ margin: '0 0 10px 0', color: '#388e3c' }}>✅ FHE加密</h6>
              <p style={{ fontSize: '14px', margin: 0, lineHeight: '1.5' }}>
                直接在加密数据上计算<br/>
                数据始终保持加密状态<br/>
                完全隐私保护
              </p>
            </div>
          </div>
        </div>

        <div>
          <h5>FHE运算示例：</h5>
          <div style={{ padding: '15px', backgroundColor: 'white', borderRadius: '6px', fontFamily: 'monospace', fontSize: '14px' }}>
            <div style={{ marginBottom: '10px' }}>
              <span style={{ color: '#666' }}>// 传统方式：</span><br/>
              <span style={{ color: '#1976D2' }}>decrypt(a) + decrypt(b) = result</span>
            </div>
            <div>
              <span style={{ color: '#666' }}>// FHE方式：</span><br/>
              <span style={{ color: '#388e3c' }}>FHE.add(encrypted_a, encrypted_b) = encrypted_result</span>
            </div>
          </div>
        </div>
      </div>

      {/* FHEVM架构 */}
      <div style={{ marginBottom: '30px', padding: '25px', backgroundColor: '#fff3e0', borderRadius: '8px', border: '1px solid #ff9800' }}>
        <h4 style={{ marginTop: 0, color: '#f57c00' }}>🏗️ FHEVM架构组件</h4>
        <p style={{ marginBottom: '20px', lineHeight: '1.6' }}>
          Zama的FHEVM (Fully Homomorphic Encryption Virtual Machine) 是一个完整的隐私保护计算生态系统：
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
          <div style={{ padding: '15px', backgroundColor: 'white', borderRadius: '6px', border: '1px solid #e0e0e0' }}>
            <h6 style={{ margin: '0 0 10px 0', color: '#1976D2' }}>📚 Solidity库</h6>
            <p style={{ fontSize: '13px', margin: 0, lineHeight: '1.4' }}>
              提供加密数据类型(euint32, ebool等)和FHE运算函数
            </p>
          </div>

          <div style={{ padding: '15px', backgroundColor: 'white', borderRadius: '6px', border: '1px solid #e0e0e0' }}>
            <h6 style={{ margin: '0 0 10px 0', color: '#1976D2' }}>🔐 KMS密钥管理</h6>
            <p style={{ fontSize: '13px', margin: 0, lineHeight: '1.4' }}>
              分布式密钥生成和管理系统，确保密钥安全
            </p>
          </div>

          <div style={{ padding: '15px', backgroundColor: 'white', borderRadius: '6px', border: '1px solid #e0e0e0' }}>
            <h6 style={{ margin: '0 0 10px 0', color: '#1976D2' }}>⚡ 协处理器</h6>
            <p style={{ fontSize: '13px', margin: 0, lineHeight: '1.4' }}>
              执行FHE计算的专用处理单元，优化性能
            </p>
          </div>

          <div style={{ padding: '15px', backgroundColor: 'white', borderRadius: '6px', border: '1px solid #e0e0e0' }}>
            <h6 style={{ margin: '0 0 10px 0', color: '#1976D2' }}>🌉 网关</h6>
            <p style={{ fontSize: '13px', margin: 0, lineHeight: '1.4' }}>
              协调加密输入、访问控制和跨链桥接
            </p>
          </div>

          <div style={{ padding: '15px', backgroundColor: 'white', borderRadius: '6px', border: '1px solid #e0e0e0' }}>
            <h6 style={{ margin: '0 0 10px 0', color: '#1976D2' }}>🔄 中继器</h6>
            <p style={{ fontSize: '13px', margin: 0, lineHeight: '1.4' }}>
              连接用户和FHE基础设施的服务层
            </p>
          </div>

          <div style={{ padding: '15px', backgroundColor: 'white', borderRadius: '6px', border: '1px solid #e0e0e0' }}>
            <h6 style={{ margin: '0 0 10px 0', color: '#1976D2' }}>🔮 预言机</h6>
            <p style={{ fontSize: '13px', margin: 0, lineHeight: '1.4' }}>
              处理异步解密和外部数据集成
            </p>
          </div>
        </div>
      </div>

      {/* 支持的数据类型 */}
      <div style={{ marginBottom: '30px', padding: '25px', backgroundColor: '#fce4ec', borderRadius: '8px', border: '1px solid #e91e63' }}>
        <h4 style={{ marginTop: 0, color: '#c2185b' }}>🔢 支持的加密数据类型</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          <div style={{ padding: '12px', backgroundColor: 'white', borderRadius: '6px' }}>
            <strong>ebool</strong> - 加密布尔值<br/>
            <span style={{ fontSize: '12px', color: '#666' }}>2位加密布尔类型</span>
          </div>
          <div style={{ padding: '12px', backgroundColor: 'white', borderRadius: '6px' }}>
            <strong>euint8/16/32/64</strong> - 加密整数<br/>
            <span style={{ fontSize: '12px', color: '#666' }}>不同位数的无符号整数</span>
          </div>
          <div style={{ padding: '12px', backgroundColor: 'white', borderRadius: '6px' }}>
            <strong>eaddress</strong> - 加密地址<br/>
            <span style={{ fontSize: '12px', color: '#666' }}>160位以太坊地址类型</span>
          </div>
          <div style={{ padding: '12px', backgroundColor: 'white', borderRadius: '6px' }}>
            <strong>euint256</strong> - 大整数<br/>
            <span style={{ fontSize: '12px', color: '#666' }}>256位大数类型</span>
          </div>
        </div>
      </div>

      {/* FHE运算操作 */}
      <div style={{ marginBottom: '30px', padding: '25px', backgroundColor: '#f3e5f5', borderRadius: '8px', border: '1px solid #9c27b0' }}>
        <h4 style={{ marginTop: 0, color: '#7b1fa2' }}>⚙️ FHE运算操作</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
          <div>
            <h6 style={{ color: '#7b1fa2' }}>🧮 算术运算</h6>
            <ul style={{ fontSize: '14px', lineHeight: '1.4' }}>
              <li>FHE.add() - 加法</li>
              <li>FHE.sub() - 减法</li>
              <li>FHE.mul() - 乘法</li>
              <li>FHE.div() - 除法</li>
            </ul>
          </div>
          <div>
            <h6 style={{ color: '#7b1fa2' }}>🔍 比较运算</h6>
            <ul style={{ fontSize: '14px', lineHeight: '1.4' }}>
              <li>FHE.eq() - 等于</li>
              <li>FHE.lt() - 小于</li>
              <li>FHE.gt() - 大于</li>
              <li>FHE.le() - 小于等于</li>
            </ul>
          </div>
          <div>
            <h6 style={{ color: '#7b1fa2' }}>🔀 逻辑运算</h6>
            <ul style={{ fontSize: '14px', lineHeight: '1.4' }}>
              <li>FHE.and() - 逻辑与</li>
              <li>FHE.or() - 逻辑或</li>
              <li>FHE.not() - 逻辑非</li>
              <li>FHE.select() - 条件选择</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 学习路径 */}
      <div style={{ padding: '25px', backgroundColor: '#e8f5e8', borderRadius: '8px', border: '1px solid #4caf50' }}>
        <h4 style={{ marginTop: 0, color: '#388e3c' }}>🎓 接下来的学习之旅</h4>
        <p style={{ marginBottom: '15px', lineHeight: '1.6' }}>
          通过本课程，你将逐步掌握Zama FHE技术的核心概念和实际应用：
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '15px' }}>
          <div>
            <h6 style={{ color: '#388e3c' }}>🔰 基础篇</h6>
            <ul style={{ fontSize: '14px', lineHeight: '1.4' }}>
              <li>SDK配置和初始化</li>
              <li>加密数据存储</li>
              <li>用户解密操作</li>
            </ul>
          </div>
          <div>
            <h6 style={{ color: '#388e3c' }}>🚀 进阶篇</h6>
            <ul style={{ fontSize: '14px', lineHeight: '1.4' }}>
              <li>链上异步解密</li>
              <li>FHE计算操作</li>
              <li>复杂应用场景</li>
            </ul>
          </div>
        </div>
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: 'white', borderRadius: '6px', textAlign: 'center' }}>
          <strong style={{ color: '#388e3c' }}>💡 准备好开始你的隐私计算之旅了吗？</strong>
        </div>
      </div>
    </div>
  )
}

export default ZamaIntro