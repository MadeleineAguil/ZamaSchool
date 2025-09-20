// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE, euint32, externalEuint32, ebool} from "@fhevm/solidity/lib/FHE.sol";
import {SepoliaConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

contract NumberStorage is SepoliaConfig {
    mapping(address => euint32) private userNumbers;
    mapping(address => euint32) private calculationResults;
    mapping(address => ebool) private comparisonResults;

    event NumberStored(address indexed user);
    event CalculationPerformed(address indexed user, string operation);
    event ComparisonPerformed(address indexed user, string comparisonType);

    function storeNumber(externalEuint32 inputNumber, bytes calldata inputProof) external {
        euint32 encryptedNumber = FHE.fromExternal(inputNumber, inputProof);

        userNumbers[msg.sender] = encryptedNumber;

        FHE.allowThis(userNumbers[msg.sender]);
        FHE.allow(userNumbers[msg.sender], msg.sender);

        emit NumberStored(msg.sender);
    }

    function getStoredNumberByUser(address user) external view returns (euint32) {
        return userNumbers[user];
    }

    function getCalculationResult(address user) external view returns (euint32) {
        return calculationResults[user];
    }

    function getComparisonResult(address user) external view returns (ebool) {
        return comparisonResults[user];
    }

    // 加法运算
    function addToStoredNumber(externalEuint32 inputNumber, bytes calldata inputProof) external {
        require(FHE.isInitialized(userNumbers[msg.sender]), "No stored number found");

        euint32 numberToAdd = FHE.fromExternal(inputNumber, inputProof);
        euint32 result = FHE.add(userNumbers[msg.sender], numberToAdd);

        calculationResults[msg.sender] = result;

        FHE.allowThis(calculationResults[msg.sender]);
        FHE.allow(calculationResults[msg.sender], msg.sender);

        emit CalculationPerformed(msg.sender, "addition");
    }

    // 减法运算
    function subtractFromStoredNumber(externalEuint32 inputNumber, bytes calldata inputProof) external {
        require(FHE.isInitialized(userNumbers[msg.sender]), "No stored number found");

        euint32 numberToSubtract = FHE.fromExternal(inputNumber, inputProof);
        euint32 result = FHE.sub(userNumbers[msg.sender], numberToSubtract);

        calculationResults[msg.sender] = result;

        FHE.allowThis(calculationResults[msg.sender]);
        FHE.allow(calculationResults[msg.sender], msg.sender);

        emit CalculationPerformed(msg.sender, "subtraction");
    }

    // 乘法运算
    function multiplyStoredNumber(externalEuint32 inputNumber, bytes calldata inputProof) external {
        require(FHE.isInitialized(userNumbers[msg.sender]), "No stored number found");

        euint32 numberToMultiply = FHE.fromExternal(inputNumber, inputProof);
        euint32 result = FHE.mul(userNumbers[msg.sender], numberToMultiply);

        calculationResults[msg.sender] = result;

        FHE.allowThis(calculationResults[msg.sender]);
        FHE.allow(calculationResults[msg.sender], msg.sender);

        emit CalculationPerformed(msg.sender, "multiplication");
    }

    // 除法运算 (使用常数除数)
    function divideStoredNumber(uint32 divisor) external {
        require(FHE.isInitialized(userNumbers[msg.sender]), "No stored number found");
        require(divisor > 0, "Divisor must be greater than 0");

        euint32 result = FHE.div(userNumbers[msg.sender], divisor);

        calculationResults[msg.sender] = result;

        FHE.allowThis(calculationResults[msg.sender]);
        FHE.allow(calculationResults[msg.sender], msg.sender);

        emit CalculationPerformed(msg.sender, "division");
    }

    // 两个用户存储数字相加
    function addTwoStoredNumbers(address userA, address userB) external {
        require(FHE.isInitialized(userNumbers[userA]), "UserA has no stored number");
        require(FHE.isInitialized(userNumbers[userB]), "UserB has no stored number");

        euint32 result = FHE.add(userNumbers[userA], userNumbers[userB]);

        calculationResults[msg.sender] = result;

        FHE.allowThis(calculationResults[msg.sender]);
        FHE.allow(calculationResults[msg.sender], msg.sender);

        emit CalculationPerformed(msg.sender, "add_two_users");
    }

    // === 数字比较功能 ===

    // 比较存储的数字是否等于输入数字
    function compareStoredNumberEqual(externalEuint32 inputNumber, bytes calldata inputProof) external {
        require(FHE.isInitialized(userNumbers[msg.sender]), "No stored number found");

        euint32 numberToCompare = FHE.fromExternal(inputNumber, inputProof);
        ebool result = FHE.eq(userNumbers[msg.sender], numberToCompare);

        comparisonResults[msg.sender] = result;

        FHE.allowThis(comparisonResults[msg.sender]);
        FHE.allow(comparisonResults[msg.sender], msg.sender);

        emit ComparisonPerformed(msg.sender, "equal");
    }

    // 比较存储的数字是否大于输入数字
    function compareStoredNumberGreater(externalEuint32 inputNumber, bytes calldata inputProof) external {
        require(FHE.isInitialized(userNumbers[msg.sender]), "No stored number found");

        euint32 numberToCompare = FHE.fromExternal(inputNumber, inputProof);
        ebool result = FHE.gt(userNumbers[msg.sender], numberToCompare);

        comparisonResults[msg.sender] = result;

        FHE.allowThis(comparisonResults[msg.sender]);
        FHE.allow(comparisonResults[msg.sender], msg.sender);

        emit ComparisonPerformed(msg.sender, "greater");
    }

    // 比较存储的数字是否小于输入数字
    function compareStoredNumberLess(externalEuint32 inputNumber, bytes calldata inputProof) external {
        require(FHE.isInitialized(userNumbers[msg.sender]), "No stored number found");

        euint32 numberToCompare = FHE.fromExternal(inputNumber, inputProof);
        ebool result = FHE.lt(userNumbers[msg.sender], numberToCompare);

        comparisonResults[msg.sender] = result;

        FHE.allowThis(comparisonResults[msg.sender]);
        FHE.allow(comparisonResults[msg.sender], msg.sender);

        emit ComparisonPerformed(msg.sender, "less");
    }

    // 比较存储的数字是否大于等于输入数字
    function compareStoredNumberGreaterOrEqual(externalEuint32 inputNumber, bytes calldata inputProof) external {
        require(FHE.isInitialized(userNumbers[msg.sender]), "No stored number found");

        euint32 numberToCompare = FHE.fromExternal(inputNumber, inputProof);
        ebool result = FHE.ge(userNumbers[msg.sender], numberToCompare);

        comparisonResults[msg.sender] = result;

        FHE.allowThis(comparisonResults[msg.sender]);
        FHE.allow(comparisonResults[msg.sender], msg.sender);

        emit ComparisonPerformed(msg.sender, "greater_or_equal");
    }

    // 比较存储的数字是否小于等于输入数字
    function compareStoredNumberLessOrEqual(externalEuint32 inputNumber, bytes calldata inputProof) external {
        require(FHE.isInitialized(userNumbers[msg.sender]), "No stored number found");

        euint32 numberToCompare = FHE.fromExternal(inputNumber, inputProof);
        ebool result = FHE.le(userNumbers[msg.sender], numberToCompare);

        comparisonResults[msg.sender] = result;

        FHE.allowThis(comparisonResults[msg.sender]);
        FHE.allow(comparisonResults[msg.sender], msg.sender);

        emit ComparisonPerformed(msg.sender, "less_or_equal");
    }

    // 比较两个用户存储的数字大小
    function compareTwoUsersNumbers(address userA, address userB, string calldata comparisonType) external {
        require(FHE.isInitialized(userNumbers[userA]), "UserA has no stored number");
        require(FHE.isInitialized(userNumbers[userB]), "UserB has no stored number");

        ebool result;

        if (keccak256(abi.encodePacked(comparisonType)) == keccak256(abi.encodePacked("equal"))) {
            result = FHE.eq(userNumbers[userA], userNumbers[userB]);
        } else if (keccak256(abi.encodePacked(comparisonType)) == keccak256(abi.encodePacked("greater"))) {
            result = FHE.gt(userNumbers[userA], userNumbers[userB]);
        } else if (keccak256(abi.encodePacked(comparisonType)) == keccak256(abi.encodePacked("less"))) {
            result = FHE.lt(userNumbers[userA], userNumbers[userB]);
        } else {
            revert("Invalid comparison type. Use: equal, greater, less");
        }

        comparisonResults[msg.sender] = result;

        FHE.allowThis(comparisonResults[msg.sender]);
        FHE.allow(comparisonResults[msg.sender], msg.sender);

        emit ComparisonPerformed(msg.sender, string(abi.encodePacked("compare_users_", comparisonType)));
    }
}