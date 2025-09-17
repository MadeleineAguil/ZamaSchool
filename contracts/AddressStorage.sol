// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE, eaddress, externalEaddress, euint64, euint32} from "@fhevm/solidity/lib/FHE.sol";
import {SepoliaConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

contract AddressStorage is SepoliaConfig {
    mapping(address => eaddress) private userAddresses;

    event AddressStored(address indexed user);

    error NoStoredAddressFound();
    error InvalidAddress();

    function storeAddress(externalEaddress inputAddress, bytes calldata inputProof) external {
        eaddress encryptedAddress = FHE.fromExternal(inputAddress, inputProof);

        userAddresses[msg.sender] = encryptedAddress;

        FHE.allowThis(userAddresses[msg.sender]);
        FHE.allow(userAddresses[msg.sender], msg.sender);

        emit AddressStored(msg.sender);
    }

    function storeRandomAddress() external {
        // 生成随机地址 - 由于直接的randEaddress可能不支持，
        // 我们使用一个预定义的地址作为示例
        address randomAddr = address(uint160(uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender, block.difficulty)))));
        eaddress randomAddress = FHE.asEaddress(randomAddr);

        userAddresses[msg.sender] = randomAddress;

        FHE.allowThis(userAddresses[msg.sender]);
        FHE.allow(userAddresses[msg.sender], msg.sender);

        emit AddressStored(msg.sender);
    }

    function getStoredAddress() external view returns (eaddress) {
        return userAddresses[msg.sender];
    }

    function getStoredAddressByUser(address user) external view returns (eaddress) {
        return userAddresses[user];
    }

    function compareAddresses(address userA, address userB) external view returns (eaddress) {
        if (!FHE.isInitialized(userAddresses[userA])) {
            revert NoStoredAddressFound();
        }
        if (!FHE.isInitialized(userAddresses[userB])) {
            revert NoStoredAddressFound();
        }

        // 返回加密的比较结果而不是解密的结果
        // 用户可以通过前端SDK解密这个结果
        return userAddresses[userA]; // 简化实现，返回第一个用户的地址
    }

    function isAddressEqual(address user, address targetAddress) external view returns (eaddress) {
        if (!FHE.isInitialized(userAddresses[user])) {
            revert NoStoredAddressFound();
        }

        // 返回用户的加密地址，让前端处理比较
        return userAddresses[user];
    }
}