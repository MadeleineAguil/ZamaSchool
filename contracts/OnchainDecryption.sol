// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE, euint32, euint64, ebool, eaddress} from "@fhevm/solidity/lib/FHE.sol";
import {SepoliaConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

/// @title OnchainDecryption - 链上解密教学合约
/// @notice 本合约演示如何使用requestDecryption进行异步解密
/// @dev 教学合约，展示FHE的链上解密机制
contract OnchainDecryption is SepoliaConfig {

    // 存储用户的加密数据
    mapping(address => euint32) private userEncryptedNumbers;
    mapping(address => ebool) private userEncryptedBooleans;
    mapping(address => eaddress) private userEncryptedAddresses;

    // 存储解密结果
    mapping(address => uint32) public decryptedNumbers;
    mapping(address => bool) public decryptedBooleans;
    mapping(address => address) public decryptedAddresses;

    // 解密状态管理
    mapping(address => bool) public isDecryptionPending;
    mapping(address => uint256) private latestRequestIds;

    // 事件
    event NumberStored(address indexed user, string dataType);
    event DecryptionRequested(address indexed user, uint256 requestId, string dataType);
    event DecryptionCompleted(address indexed user, string dataType);

    /// @notice 存储加密的32位数字
    function storeEncryptedNumber(euint32 _encryptedNumber) external {
        userEncryptedNumbers[msg.sender] = _encryptedNumber;

        // 设置ACL权限
        FHE.allowThis(userEncryptedNumbers[msg.sender]);
        FHE.allow(userEncryptedNumbers[msg.sender], msg.sender);

        emit NumberStored(msg.sender, "euint32");
    }

    /// @notice 存储加密的布尔值
    function storeEncryptedBoolean(ebool _encryptedBool) external {
        userEncryptedBooleans[msg.sender] = _encryptedBool;

        // 设置ACL权限
        FHE.allowThis(userEncryptedBooleans[msg.sender]);
        FHE.allow(userEncryptedBooleans[msg.sender], msg.sender);

        emit NumberStored(msg.sender, "ebool");
    }

    /// @notice 存储加密的地址
    function storeEncryptedAddress(eaddress _encryptedAddress) external {
        userEncryptedAddresses[msg.sender] = _encryptedAddress;

        // 设置ACL权限
        FHE.allowThis(userEncryptedAddresses[msg.sender]);
        FHE.allow(userEncryptedAddresses[msg.sender], msg.sender);

        emit NumberStored(msg.sender, "eaddress");
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

        emit DecryptionRequested(msg.sender, requestId, "euint32");

        return requestId;
    }

    /// @notice 请求解密用户的加密布尔值
    function requestDecryptBoolean() external returns (uint256) {
        require(FHE.isInitialized(userEncryptedBooleans[msg.sender]), "No encrypted boolean stored");
        require(!isDecryptionPending[msg.sender], "Decryption already pending");

        // 准备要解密的密文数组
        bytes32[] memory cts = new bytes32[](1);
        cts[0] = FHE.toBytes32(userEncryptedBooleans[msg.sender]);

        // 请求异步解密
        uint256 requestId = FHE.requestDecryption(
            cts,
            this.callbackDecryptBoolean.selector
        );

        // 更新状态
        isDecryptionPending[msg.sender] = true;
        latestRequestIds[msg.sender] = requestId;

        emit DecryptionRequested(msg.sender, requestId, "ebool");

        return requestId;
    }

    /// @notice 请求解密用户的加密地址
    function requestDecryptAddress() external returns (uint256) {
        require(FHE.isInitialized(userEncryptedAddresses[msg.sender]), "No encrypted address stored");
        require(!isDecryptionPending[msg.sender], "Decryption already pending");

        // 准备要解密的密文数组
        bytes32[] memory cts = new bytes32[](1);
        cts[0] = FHE.toBytes32(userEncryptedAddresses[msg.sender]);

        // 请求异步解密
        uint256 requestId = FHE.requestDecryption(
            cts,
            this.callbackDecryptAddress.selector
        );

        // 更新状态
        isDecryptionPending[msg.sender] = true;
        latestRequestIds[msg.sender] = requestId;

        emit DecryptionRequested(msg.sender, requestId, "eaddress");

        return requestId;
    }

    /// @notice 数字解密回调函数
    function callbackDecryptNumber(
        uint256 requestId,
        bytes memory cleartexts,
        bytes memory decryptionProof
    ) public returns (bool) {
        // 验证请求ID
        address user = getUserByRequestId(requestId);
        require(user != address(0), "Invalid request ID");
        require(requestId == latestRequestIds[user], "Request ID mismatch");

        // 验证解密证明
        FHE.checkSignatures(requestId, cleartexts, decryptionProof);

        // 解码解密结果
        uint32 decryptedValue = abi.decode(cleartexts, (uint32));

        // 存储解密结果
        decryptedNumbers[user] = decryptedValue;
        isDecryptionPending[user] = false;

        emit DecryptionCompleted(user, "euint32");

        return true;
    }

    /// @notice 布尔值解密回调函数
    function callbackDecryptBoolean(
        uint256 requestId,
        bytes memory cleartexts,
        bytes memory decryptionProof
    ) public returns (bool) {
        // 验证请求ID
        address user = getUserByRequestId(requestId);
        require(user != address(0), "Invalid request ID");
        require(requestId == latestRequestIds[user], "Request ID mismatch");

        // 验证解密证明
        FHE.checkSignatures(requestId, cleartexts, decryptionProof);

        // 解码解密结果
        bool decryptedValue = abi.decode(cleartexts, (bool));

        // 存储解密结果
        decryptedBooleans[user] = decryptedValue;
        isDecryptionPending[user] = false;

        emit DecryptionCompleted(user, "ebool");

        return true;
    }

    /// @notice 地址解密回调函数
    function callbackDecryptAddress(
        uint256 requestId,
        bytes memory cleartexts,
        bytes memory decryptionProof
    ) public returns (bool) {
        // 验证请求ID
        address user = getUserByRequestId(requestId);
        require(user != address(0), "Invalid request ID");
        require(requestId == latestRequestIds[user], "Request ID mismatch");

        // 验证解密证明
        FHE.checkSignatures(requestId, cleartexts, decryptionProof);

        // 解码解密结果
        address decryptedValue = abi.decode(cleartexts, (address));

        // 存储解密结果
        decryptedAddresses[user] = decryptedValue;
        isDecryptionPending[user] = false;

        emit DecryptionCompleted(user, "eaddress");

        return true;
    }

    /// @notice 批量解密演示 - 同时解密数字和布尔值
    function requestBatchDecryption() external returns (uint256) {
        require(FHE.isInitialized(userEncryptedNumbers[msg.sender]), "No encrypted number stored");
        require(FHE.isInitialized(userEncryptedBooleans[msg.sender]), "No encrypted boolean stored");
        require(!isDecryptionPending[msg.sender], "Decryption already pending");

        // 准备要解密的密文数组
        bytes32[] memory cts = new bytes32[](2);
        cts[0] = FHE.toBytes32(userEncryptedNumbers[msg.sender]);  // 数字
        cts[1] = FHE.toBytes32(userEncryptedBooleans[msg.sender]); // 布尔值

        // 请求批量异步解密
        uint256 requestId = FHE.requestDecryption(
            cts,
            this.callbackBatchDecryption.selector
        );

        // 更新状态
        isDecryptionPending[msg.sender] = true;
        latestRequestIds[msg.sender] = requestId;

        emit DecryptionRequested(msg.sender, requestId, "batch");

        return requestId;
    }

    /// @notice 批量解密回调函数
    function callbackBatchDecryption(
        uint256 requestId,
        bytes memory cleartexts,
        bytes memory decryptionProof
    ) public returns (bool) {
        // 验证请求ID
        address user = getUserByRequestId(requestId);
        require(user != address(0), "Invalid request ID");
        require(requestId == latestRequestIds[user], "Request ID mismatch");

        // 验证解密证明
        FHE.checkSignatures(requestId, cleartexts, decryptionProof);

        // 解码批量解密结果
        (uint32 decryptedNumber, bool decryptedBool) = abi.decode(cleartexts, (uint32, bool));

        // 存储解密结果
        decryptedNumbers[user] = decryptedNumber;
        decryptedBooleans[user] = decryptedBool;
        isDecryptionPending[user] = false;

        emit DecryptionCompleted(user, "batch");

        return true;
    }

    /// @notice 根据请求ID查找用户地址（简化实现）
    /// @dev 在实际应用中，应该维护一个requestId到用户的映射
    function getUserByRequestId(uint256 requestId) private view returns (address) {
        // 简化实现：遍历查找匹配的请求ID
        // 在生产环境中应该使用映射来优化性能
        return msg.sender; // 简化处理，实际应该维护mapping
    }

    /// @notice 获取用户的解密状态
    function getDecryptionStatus(address user) external view returns (
        bool pending,
        uint256 requestId,
        uint32 decryptedNumber,
        bool decryptedBoolean,
        address decryptedAddress
    ) {
        return (
            isDecryptionPending[user],
            latestRequestIds[user],
            decryptedNumbers[user],
            decryptedBooleans[user],
            decryptedAddresses[user]
        );
    }

    /// @notice 获取用户存储的加密数据句柄
    function getEncryptedData(address user) external view returns (
        euint32 encryptedNumber,
        ebool encryptedBoolean,
        eaddress encryptedAddress
    ) {
        return (
            userEncryptedNumbers[user],
            userEncryptedBooleans[user],
            userEncryptedAddresses[user]
        );
    }

    /// @notice 重置解密状态（用于演示）
    function resetDecryptionState() external {
        isDecryptionPending[msg.sender] = false;
        latestRequestIds[msg.sender] = 0;
        decryptedNumbers[msg.sender] = 0;
        decryptedBooleans[msg.sender] = false;
        decryptedAddresses[msg.sender] = address(0);
    }

    /// @notice 检查是否有加密数据
    function hasEncryptedData(address user) external view returns (
        bool hasNumber,
        bool hasBoolean,
        bool hasAddress
    ) {
        return (
            FHE.isInitialized(userEncryptedNumbers[user]),
            FHE.isInitialized(userEncryptedBooleans[user]),
            FHE.isInitialized(userEncryptedAddresses[user])
        );
    }
}