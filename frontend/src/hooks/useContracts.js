import { useState } from 'react'
import { useAccount, useReadContract } from 'wagmi'
import { Contract } from 'ethers'
import { useEthersSigner } from './useEthersSigner'
import { getContractAddress } from '../config/contracts'
import NumberStorageABI from '../config/NumberStorageABI'
import AddressStorageABI from '../config/AddressStorageABI'
import OnchainDecryptionABI from '../config/OnchainDecryptionABI'

export const useNumberStorage = () => {
  const { address, chainId } = useAccount()
  const contractAddress = getContractAddress('NumberStorage', chainId)
  const signer = useEthersSigner({ chainId })

  // State management
  const [isWriting, setIsWriting] = useState(false)
  const [writeData, setWriteData] = useState(null)

  // Read stored number
  const {
    data: storedNumber,
    isError: getStoredError,
    isLoading: isGettingStored,
    refetch: refetchStoredNumber,
  } = useReadContract({
    address: contractAddress,
    abi: NumberStorageABI,
    functionName: 'getStoredNumberByUser',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!contractAddress,
    }
  })

  // Read calculation result
  const {
    data: calculationResult,
    isError: getResultError,
    isLoading: isGettingResult
  } = useReadContract({
    address: contractAddress,
    abi: NumberStorageABI,
    functionName: 'getCalculationResult',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!contractAddress,
    }
  })

  // Store number
  const storeNumber = async (params) => {
    if (!signer || !contractAddress) return
    setIsWriting(true)
    try {
      const signerPromise = await signer
      const contract = new Contract(contractAddress, NumberStorageABI, signerPromise)
      // 兼容旧的参数格式
      const args = params.args || params
      const tx = await contract.storeNumber(...args)
      setWriteData(tx)
      await tx.wait()
      // refresh stored number handle after successful tx
      try { await refetchStoredNumber?.() } catch {}
      return tx
    } catch (error) {
      console.error('Error storing number:', error)
      throw error
    } finally {
      setIsWriting(false)
    }
  }

  // Addition operation
  const addToStoredNumber = async (params) => {
    if (!signer || !contractAddress) return
    setIsWriting(true)
    try {
      const signerPromise = await signer
      const contract = new Contract(contractAddress, NumberStorageABI, signerPromise)
      const args = params.args || params
      const tx = await contract.addToStoredNumber(...args)
      setWriteData(tx)
      await tx.wait()
      return tx
    } catch (error) {
      console.error('Error adding to stored number:', error)
      throw error
    } finally {
      setIsWriting(false)
    }
  }

  // Subtraction operation
  const subtractFromStoredNumber = async (params) => {
    if (!signer || !contractAddress) return
    setIsWriting(true)
    try {
      const signerPromise = await signer
      const contract = new Contract(contractAddress, NumberStorageABI, signerPromise)
      const args = params.args || params
      const tx = await contract.subtractFromStoredNumber(...args)
      setWriteData(tx)
      await tx.wait()
      return tx
    } catch (error) {
      console.error('Error subtracting from stored number:', error)
      throw error
    } finally {
      setIsWriting(false)
    }
  }

  // Multiplication operation
  const multiplyStoredNumber = async (params) => {
    if (!signer || !contractAddress) return
    setIsWriting(true)
    try {
      const signerPromise = await signer
      const contract = new Contract(contractAddress, NumberStorageABI, signerPromise)
      const args = params.args || params
      const tx = await contract.multiplyStoredNumber(...args)
      setWriteData(tx)
      await tx.wait()
      return tx
    } catch (error) {
      console.error('Error multiplying stored number:', error)
      throw error
    } finally {
      setIsWriting(false)
    }
  }

  // Division operation
  const divideStoredNumber = async (params) => {
    if (!signer || !contractAddress) return
    setIsWriting(true)
    try {
      const signerPromise = await signer
      const contract = new Contract(contractAddress, NumberStorageABI, signerPromise)
      const args = params.args || params
      const tx = await contract.divideStoredNumber(...args)
      setWriteData(tx)
      await tx.wait()
      return tx
    } catch (error) {
      console.error('Error dividing stored number:', error)
      throw error
    } finally {
      setIsWriting(false)
    }
  }

  // Generic write contract method
  const writeContract = async ({ functionName, args = [] }) => {
    if (!signer || !contractAddress) return
    setIsWriting(true)
    try {
      const signerPromise = await signer
      const contract = new Contract(contractAddress, NumberStorageABI, signerPromise)
      const tx = await contract[functionName](...args)
      setWriteData(tx)
      await tx.wait()
      return tx
    } catch (error) {
      console.error(`Error calling ${functionName}:`, error)
      throw error
    } finally {
      setIsWriting(false)
    }
  }

  return {
    contractAddress,
    // Storage
    storeNumber,
    storedNumber,
    isGettingStored,
    getStoredError,
    refetchStoredNumber,
    // Calculation
    calculationResult,
    isGettingResult,
    getResultError,
    // Operation functions
    addToStoredNumber,
    subtractFromStoredNumber,
    multiplyStoredNumber,
    divideStoredNumber,
    // Generic write method
    writeContract,
    // Write status
    isWriting,
    writeData
  }
}

export const useAddressStorage = () => {
  const { address, chainId } = useAccount()
  const contractAddress = getContractAddress('AddressStorage', chainId)
  const signer = useEthersSigner({ chainId })

  // State management
  const [isWriting, setIsWriting] = useState(false)
  const [writeData, setWriteData] = useState(null)

  // Read stored address
  const {
    data: storedAddress,
    isError: getStoredError,
    isLoading: isGettingStored
  } = useReadContract({
    address: contractAddress,
    abi: AddressStorageABI,
    functionName: 'getStoredAddressByUser',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!contractAddress,
    }
  })

  // Store address
  const storeAddress = async (params) => {
    if (!signer || !contractAddress) return
    setIsWriting(true)
    try {
      const signerPromise = await signer
      const contract = new Contract(contractAddress, AddressStorageABI, signerPromise)
      const args = params.args || params
      const tx = await contract.storeAddress(...args)
      setWriteData(tx)
      await tx.wait()
      return tx
    } catch (error) {
      console.error('Error storing address:', error)
      throw error
    } finally {
      setIsWriting(false)
    }
  }

  // Store random address
  const storeRandomAddress = async () => {
    if (!signer || !contractAddress) return
    setIsWriting(true)
    try {
      const signerPromise = await signer
      const contract = new Contract(contractAddress, AddressStorageABI, signerPromise)
      const tx = await contract.storeRandomAddress()
      setWriteData(tx)
      await tx.wait()
      return tx
    } catch (error) {
      console.error('Error storing random address:', error)
      throw error
    } finally {
      setIsWriting(false)
    }
  }

  return {
    contractAddress,
    // Storage
    storeAddress,
    storeRandomAddress,
    // Read-related
    storedAddress,
    isGettingStored,
    getStoredError,
    // Write status
    isWriting,
    writeData
  }
}

export const useOnchainDecryption = () => {
  const { address, chainId } = useAccount()
  const contractAddress = getContractAddress('OnchainDecryption', chainId)
  const signer = useEthersSigner({ chainId })

  // State management
  const [isWriting, setIsWriting] = useState(false)
  const [writeData, setWriteData] = useState(null)

  // Read decryption status
  const {
    data: decryptionStatus,
    isError: getStatusError,
    isLoading: isGettingStatus
  } = useReadContract({
    address: contractAddress,
    abi: OnchainDecryptionABI,
    functionName: 'getDecryptionStatus',
    args: [address],
    query: {
      enabled: !!address && !!contractAddress,
    }
  })

  // Store encrypted number
  const storeEncryptedNumber = async (encryptedNumber, inputProof) => {
    if (!signer || !contractAddress) return
    setIsWriting(true)
    try {
      const signerPromise = await signer
      const contract = new Contract(contractAddress, OnchainDecryptionABI, signerPromise)
      const tx = await contract.storeEncryptedNumber(encryptedNumber, inputProof)
      setWriteData(tx)
      await tx.wait()
      return tx
    } catch (error) {
      console.error('Error storing encrypted number:', error)
      throw error
    } finally {
      setIsWriting(false)
    }
  }


  // Request number decryption
  const requestDecryptNumber = async () => {
    if (!signer || !contractAddress) return
    setIsWriting(true)
    try {
      const signerPromise = await signer
      const contract = new Contract(contractAddress, OnchainDecryptionABI, signerPromise)
      const tx = await contract.requestDecryptNumber()
      setWriteData(tx)
      await tx.wait()
      return tx
    } catch (error) {
      console.error('Error requesting decrypt number:', error)
      throw error
    } finally {
      setIsWriting(false)
    }
  }


  // Reset decryption state
  const resetDecryptionState = async () => {
    if (!signer || !contractAddress) return
    setIsWriting(true)
    try {
      const signerPromise = await signer
      const contract = new Contract(contractAddress, OnchainDecryptionABI, signerPromise)
      const tx = await contract.resetDecryptionState()
      setWriteData(tx)
      await tx.wait()
      return tx
    } catch (error) {
      console.error('Error resetting decryption state:', error)
      throw error
    } finally {
      setIsWriting(false)
    }
  }

  return {
    contractAddress,
    // Storage
    storeEncryptedNumber,
    // Decryption request
    requestDecryptNumber,
    // State handlers
    resetDecryptionState,
    decryptionStatus,
    // Status
    isGettingStatus,
    getStatusError,
    // Write status
    isWriting,
    writeData
  }
}
