// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.24;

import {ConfidentialFungibleToken} from "new-confidential-contracts/token/ConfidentialFungibleToken.sol";
import {SepoliaConfig} from "@fhevm/solidity/config/ZamaConfig.sol";
import {FHE, euint64} from "@fhevm/solidity/lib/FHE.sol";

contract ConfidentialUSDT is ConfidentialFungibleToken, SepoliaConfig {
    constructor() ConfidentialFungibleToken("cUSDT", "cUSDT", "") {
    }

    function faucet() external {
        _mint(msg.sender, FHE.asEuint64(100*1000000));
    }
}
