// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE, euint32} from "@fhevm/solidity/lib/FHE.sol";
import {SepoliaConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

/// @title OnchainDecryption - 链上解密教学合约
/// @notice 本合约演示如何使用requestDecryption进行异步解密
/// @dev 教学合约，展示FHE的链上解密机制
contract OnchainDecryption is SepoliaConfig {

    // 存储用户的加密数字
    mapping(address => euint32) private userEncryptedNumbers;

    // 存储解密结果
    mapping(address => uint32) public decryptedNumbers;

    // 解密状态管理
    mapping(address => bool) public isDecryptionPending;
    mapping(address => uint256) private latestRequestIds;

    // 事件
    event NumberStored(address indexed user);
    event DecryptionRequested(address indexed user, uint256 requestId);
    event DecryptionCompleted(address indexed user, uint32 decryptedValue);

    mapping (uint256=>address) public requestIds;

    /// @notice 存储加密的32位数字
    function storeEncryptedNumber(euint32 _encryptedNumber) external {
        userEncryptedNumbers[msg.sender] = _encryptedNumber;

        // 设置ACL权限
        FHE.allowThis(userEncryptedNumbers[msg.sender]);
        FHE.allow(userEncryptedNumbers[msg.sender], msg.sender);

        emit NumberStored(msg.sender);
    }

    /// @notice 请求解密用户的加密数字
    function requestDecryptNumber() external returns (uint256) {
        require(FHE.isInitialized(userEncryptedNumbers[msg.sender]), "No encrypted number stored");
        require(!isDecryptionPending[msg.sender], "Decryption already pending");

        // 准备要解密的密文数组
        bytes32[] memory cts = new bytes32[](1);
        cts[0] = FHE.toBytes32(userEncryptedNumbers[msg.sender]);

        // 请求异步解密
        uint256 requestId = FHE.requestDecryption(
            cts,
            this.callbackDecryptNumber.selector
        );

        // 更新状态
        isDecryptionPending[msg.sender] = true;
        latestRequestIds[msg.sender] = requestId;
        requestIds[requestId]=msg.sender;
        emit DecryptionRequested(msg.sender, requestId);

        return requestId;
    }

    /// @notice 数字解密回调函数
    function callbackDecryptNumber(
        uint256 requestId,
        bytes memory cleartexts,
        bytes memory decryptionProof
    ) public returns (bool) {
        // 验证请求ID
        address user = requestIds[requestId];
        require(user != address(0), "Invalid request ID");
        require(requestId == latestRequestIds[user], "Request ID mismatch");

        // 验证解密证明
        FHE.checkSignatures(requestId, cleartexts, decryptionProof);

        // 解码解密结果
        uint32 decryptedValue = abi.decode(cleartexts, (uint32));

        // 存储解密结果
        decryptedNumbers[user] = decryptedValue;
        isDecryptionPending[user] = false;

        emit DecryptionCompleted(user, decryptedValue);

        return true;
    }

    /// @notice 获取用户的解密状态
    function getDecryptionStatus(address user) external view returns (
        bool pending,
        uint256 requestId,
        uint32 decryptedNumber
    ) {
        return (
            isDecryptionPending[user],
            latestRequestIds[user],
            decryptedNumbers[user]
        );
    }

    /// @notice 获取用户存储的加密数据句柄
    function getEncryptedNumber(address user) external view returns (euint32) {
        return userEncryptedNumbers[user];
    }

    /// @notice 重置解密状态（用于演示）
    function resetDecryptionState() external {
        isDecryptionPending[msg.sender] = false;
        latestRequestIds[msg.sender] = 0;
        decryptedNumbers[msg.sender] = 0;
    }

    /// @notice 检查是否有加密数据
    function hasEncryptedNumber(address user) external view returns (bool) {
        return FHE.isInitialized(userEncryptedNumbers[user]);
    }
}