import React, { createContext, useContext, useState, useEffect } from 'react'
import { createInstance, SepoliaConfig, initSDK } from '@zama-fhe/relayer-sdk/bundle'
import { useAccount } from 'wagmi'

const FHEVMContext = createContext()

export const FHEVMProvider = ({ children }) => {
  const [instance, setInstance] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const { address } = useAccount()

  // 添加调试用的useEffect
  useEffect(() => {
    console.log('FHEVMContext状态变化 - isInitialized:', isInitialized, 'instance:', !!instance)
  }, [isInitialized, instance])

  const initFHEVM = async () => {
    console.log('initFHEVM 被调用, address:', address, 'window.ethereum:', !!window.ethereum)

    if (!address || !window.ethereum) {
      const errorMsg = '请先连接钱包'
      console.log('初始化失败:', errorMsg)
      setError(errorMsg)
      return false
    }

    try {
      console.log('开始初始化...')
      setIsLoading(true)
      setError(null)

      // 初始化SDK
      console.log('正在调用 initSDK()...')
      await initSDK()
      console.log('initSDK() 完成')

      // 创建FHEVM实例
      const config = {
        ...SepoliaConfig,
        network: window.ethereum
      }
      console.log('创建实例，config:', config)

      const fhevmInstance = await createInstance(config)
      console.log('实例创建成功:', !!fhevmInstance)

      setInstance(fhevmInstance)
      setIsInitialized(true)
      console.log('Context状态已更新: instance和isInitialized设置为true')
      return true
    } catch (err) {
      console.error('Failed to initialize FHEVM:', err)
      setError(err.message)
      return false
    } finally {
      setIsLoading(false)
      console.log('加载状态已设置为false')
    }
  }

  const resetFHEVM = () => {
    setInstance(null)
    setIsInitialized(false)
    setError(null)
  }

  const value = {
    instance,
    isLoading,
    error,
    isInitialized,
    initFHEVM,
    resetFHEVM
  }

  return (
    <FHEVMContext.Provider value={value}>
      {children}
    </FHEVMContext.Provider>
  )
}

export const useFHEVM = () => {
  const context = useContext(FHEVMContext)
  if (context === undefined) {
    throw new Error('useFHEVM must be used within a FHEVMProvider')
  }
  return context
}