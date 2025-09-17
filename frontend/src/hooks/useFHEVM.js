import { useState, useEffect } from 'react'
import { createInstance, SepoliaConfig } from '@zama-fhe/relayer-sdk/bundle'
import { useAccount } from 'wagmi'

export const useFHEVM = () => {
  const [instance, setInstance] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const { address } = useAccount()

  useEffect(() => {
    const initFHEVM = async () => {
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
      } catch (err) {
        console.error('Failed to initialize FHEVM:', err)
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    if (address && window.ethereum) {
      initFHEVM()
    } else {
      setIsLoading(false)
    }
  }, [address])

  return { instance, isLoading, error }
}