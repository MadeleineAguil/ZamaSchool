// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE, euint32, externalEuint32} from "@fhevm/solidity/lib/FHE.sol";
import {SepoliaConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

contract NumberStorage is SepoliaConfig {
    mapping(address => euint32) private userNumbers;
    mapping(address => euint32) private calculationResults;

    event NumberStored(address indexed user);
    event CalculationPerformed(address indexed user, string operation);

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
}