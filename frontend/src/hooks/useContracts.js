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

  // 状态管理
  const [isWriting, setIsWriting] = useState(false)
  const [writeData, setWriteData] = useState(null)

  // 获取存储的数字
  const {
    data: storedNumber,
    isError: getStoredError,
    isLoading: isGettingStored
  } = useReadContract({
    address: contractAddress,
    abi: NumberStorageABI,
    functionName: 'getStoredNumber',
    query: {
      enabled: !!address && !!contractAddress,
    }
  })

  // 获取计算结果
  const {
    data: calculationResult,
    isError: getResultError,
    isLoading: isGettingResult
  } = useReadContract({
    address: contractAddress,
    abi: NumberStorageABI,
    functionName: 'getCalculationResult',
    query: {
      enabled: !!address && !!contractAddress,
    }
  })

  // 存储数字
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
      return tx
    } catch (error) {
      console.error('Error storing number:', error)
      throw error
    } finally {
      setIsWriting(false)
    }
  }

  // 加法运算
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

  // 减法运算
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

  // 乘法运算
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

  // 除法运算
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

  // 通用写合约方法
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
    // 存储相关
    storeNumber,
    storedNumber,
    isGettingStored,
    getStoredError,
    // 计算相关
    calculationResult,
    isGettingResult,
    getResultError,
    // 运算函数
    addToStoredNumber,
    subtractFromStoredNumber,
    multiplyStoredNumber,
    divideStoredNumber,
    // 通用写合约方法
    writeContract,
    // 写合约状态
    isWriting,
    writeData
  }
}

export const useAddressStorage = () => {
  const { address, chainId } = useAccount()
  const contractAddress = getContractAddress('AddressStorage', chainId)
  const signer = useEthersSigner({ chainId })

  // 状态管理
  const [isWriting, setIsWriting] = useState(false)
  const [writeData, setWriteData] = useState(null)

  // 获取存储的地址
  const {
    data: storedAddress,
    isError: getStoredError,
    isLoading: isGettingStored
  } = useReadContract({
    address: contractAddress,
    abi: AddressStorageABI,
    functionName: 'getStoredAddress',
    query: {
      enabled: !!address && !!contractAddress,
    }
  })

  // 存储地址
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

  // 存储随机地址
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
    // 存储相关
    storeAddress,
    storeRandomAddress,
    // 获取相关
    storedAddress,
    isGettingStored,
    getStoredError,
    // 写合约状态
    isWriting,
    writeData
  }
}

export const useOnchainDecryption = () => {
  const { address, chainId } = useAccount()
  const contractAddress = getContractAddress('OnchainDecryption', chainId)
  const signer = useEthersSigner({ chainId })

  // 状态管理
  const [isWriting, setIsWriting] = useState(false)
  const [writeData, setWriteData] = useState(null)

  // 获取解密状态
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

  // 存储加密数字
  const storeEncryptedNumber = async (encryptedNumber) => {
    if (!signer || !contractAddress) return
    setIsWriting(true)
    try {
      const signerPromise = await signer
      const contract = new Contract(contractAddress, OnchainDecryptionABI, signerPromise)
      const tx = await contract.storeEncryptedNumber(encryptedNumber)
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


  // 请求解密数字
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


  // 重置解密状态
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
    // 存储相关
    storeEncryptedNumber,
    // 解密请求相关
    requestDecryptNumber,
    // 状态管理
    resetDecryptionState,
    decryptionStatus,
    // 状态
    isGettingStatus,
    getStatusError,
    // 写合约状态
    isWriting,
    writeData
  }
}
