import { useState, useEffect } from 'react'
import { useAccount, useContractRead, useContractWrite, useWaitForTransaction } from 'wagmi'
import { getContractAddress } from '../config/contracts'
import NumberStorageABI from '../config/NumberStorageABI.json'
import AddressStorageABI from '../config/AddressStorageABI.json'

export const useNumberStorage = () => {
  const { address, chainId } = useAccount()
  const contractAddress = getContractAddress('NumberStorage', chainId)

  // 存储数字
  const {
    data: storeData,
    isLoading: isStoring,
    write: storeNumber
  } = useContractWrite({
    address: contractAddress,
    abi: NumberStorageABI,
    functionName: 'storeNumber',
  })

  // 获取存储的数字
  const {
    data: storedNumber,
    isError: getStoredError,
    isLoading: isGettingStored
  } = useContractRead({
    address: contractAddress,
    abi: NumberStorageABI,
    functionName: 'getStoredNumber',
    enabled: !!address,
  })

  // 获取计算结果
  const {
    data: calculationResult,
    isError: getResultError,
    isLoading: isGettingResult
  } = useContractRead({
    address: contractAddress,
    abi: NumberStorageABI,
    functionName: 'getCalculationResult',
    enabled: !!address,
  })

  // 加法运算
  const {
    data: addData,
    isLoading: isAdding,
    write: addToStoredNumber
  } = useContractWrite({
    address: contractAddress,
    abi: NumberStorageABI,
    functionName: 'addToStoredNumber',
  })

  // 减法运算
  const {
    data: subData,
    isLoading: isSubtracting,
    write: subtractFromStoredNumber
  } = useContractWrite({
    address: contractAddress,
    abi: NumberStorageABI,
    functionName: 'subtractFromStoredNumber',
  })

  // 乘法运算
  const {
    data: mulData,
    isLoading: isMultiplying,
    write: multiplyStoredNumber
  } = useContractWrite({
    address: contractAddress,
    abi: NumberStorageABI,
    functionName: 'multiplyStoredNumber',
  })

  // 除法运算
  const {
    data: divData,
    isLoading: isDividing,
    write: divideStoredNumber
  } = useContractWrite({
    address: contractAddress,
    abi: NumberStorageABI,
    functionName: 'divideStoredNumber',
  })

  return {
    contractAddress,
    // 存储相关
    storeNumber,
    isStoring,
    storeData,
    storedNumber,
    isGettingStored,
    getStoredError,
    // 计算相关
    calculationResult,
    isGettingResult,
    getResultError,
    // 运算函数
    addToStoredNumber,
    isAdding,
    addData,
    subtractFromStoredNumber,
    isSubtracting,
    subData,
    multiplyStoredNumber,
    isMultiplying,
    mulData,
    divideStoredNumber,
    isDividing,
    divData
  }
}

export const useAddressStorage = () => {
  const { address, chainId } = useAccount()
  const contractAddress = getContractAddress('AddressStorage', chainId)

  // 存储地址
  const {
    data: storeData,
    isLoading: isStoring,
    write: storeAddress
  } = useContractWrite({
    address: contractAddress,
    abi: AddressStorageABI,
    functionName: 'storeAddress',
  })

  // 存储随机地址
  const {
    data: storeRandomData,
    isLoading: isStoringRandom,
    write: storeRandomAddress
  } = useContractWrite({
    address: contractAddress,
    abi: AddressStorageABI,
    functionName: 'storeRandomAddress',
  })

  // 获取存储的地址
  const {
    data: storedAddress,
    isError: getStoredError,
    isLoading: isGettingStored
  } = useContractRead({
    address: contractAddress,
    abi: AddressStorageABI,
    functionName: 'getStoredAddress',
    enabled: !!address,
  })

  return {
    contractAddress,
    // 存储相关
    storeAddress,
    isStoring,
    storeData,
    storeRandomAddress,
    isStoringRandom,
    storeRandomData,
    // 获取相关
    storedAddress,
    isGettingStored,
    getStoredError
  }
}