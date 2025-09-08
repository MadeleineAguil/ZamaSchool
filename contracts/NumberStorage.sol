// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE, euint32, externalEuint32} from "@fhevm/solidity/lib/FHE.sol";
import {SepoliaConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

contract NumberStorage is SepoliaConfig {
    mapping(address => euint32) private userNumbers;
    
    event NumberStored(address indexed user);
    
    function storeNumber(externalEuint32 inputNumber, bytes calldata inputProof) external {
        euint32 encryptedNumber = FHE.fromExternal(inputNumber, inputProof);
        
        userNumbers[msg.sender] = encryptedNumber;
        
        FHE.allowThis(userNumbers[msg.sender]);
        FHE.allow(userNumbers[msg.sender], msg.sender);
        
        emit NumberStored(msg.sender);
    }
    
    function getStoredNumber() external view returns (euint32) {
        return userNumbers[msg.sender];
    }
    
    function getStoredNumberByUser(address user) external view returns (euint32) {
        return userNumbers[user];
    }
}