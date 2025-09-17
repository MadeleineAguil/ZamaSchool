import { useState } from 'react'
import { createInstance, SepoliaConfig } from '@zama-fhe/relayer-sdk/bundle'
import { useAccount } from 'wagmi'

export const useFHEVM = () => {
  const [instance, setInstance] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const { address } = useAccount()

  const initFHEVM = async () => {
    if (!address || !window.ethereum) {
      setError('请先连接钱包')
      return false
    }

    try {
      setIsLoading(true)
      setError(null)

      // 创建FHEVM实例
      const config = {
        ...SepoliaConfig,
        network: window.ethereum
      }

      const fhevmInstance = await createInstance(config)
      setInstance(fhevmInstance)
      setIsInitialized(true)
      return true
    } catch (err) {
      console.error('Failed to initialize FHEVM:', err)
      setError(err.message)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const resetFHEVM = () => {
    setInstance(null)
    setIsInitialized(false)
    setError(null)
  }

  return {
    instance,
    isLoading,
    error,
    isInitialized,
    initFHEVM,
    resetFHEVM
  }
}