import { useState, useEffect } from 'react'
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { getContractAddress } from '../config/contracts'
import NumberStorageABI from '../config/NumberStorageABI.json'
import AddressStorageABI from '../config/AddressStorageABI.json'

export const useNumberStorage = () => {
  const { address, chainId } = useAccount()
  const contractAddress = getContractAddress('NumberStorage', chainId)

  // 写合约hook
  const { writeContract, data: writeData, isPending: isWriting } = useWriteContract()

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
  const storeNumber = (args) => {
    writeContract({
      address: contractAddress,
      abi: NumberStorageABI,
      functionName: 'storeNumber',
      args
    })
  }

  // 加法运算
  const addToStoredNumber = (args) => {
    writeContract({
      address: contractAddress,
      abi: NumberStorageABI,
      functionName: 'addToStoredNumber',
      args
    })
  }

  // 减法运算
  const subtractFromStoredNumber = (args) => {
    writeContract({
      address: contractAddress,
      abi: NumberStorageABI,
      functionName: 'subtractFromStoredNumber',
      args
    })
  }

  // 乘法运算
  const multiplyStoredNumber = (args) => {
    writeContract({
      address: contractAddress,
      abi: NumberStorageABI,
      functionName: 'multiplyStoredNumber',
      args
    })
  }

  // 除法运算
  const divideStoredNumber = (args) => {
    writeContract({
      address: contractAddress,
      abi: NumberStorageABI,
      functionName: 'divideStoredNumber',
      args
    })
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
    // 写合约状态
    isWriting,
    writeData
  }
}

export const useAddressStorage = () => {
  const { address, chainId } = useAccount()
  const contractAddress = getContractAddress('AddressStorage', chainId)

  // 写合约hook
  const { writeContract, data: writeData, isPending: isWriting } = useWriteContract()

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
  const storeAddress = (args) => {
    writeContract({
      address: contractAddress,
      abi: AddressStorageABI,
      functionName: 'storeAddress',
      args
    })
  }

  // 存储随机地址
  const storeRandomAddress = () => {
    writeContract({
      address: contractAddress,
      abi: AddressStorageABI,
      functionName: 'storeRandomAddress',
    })
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