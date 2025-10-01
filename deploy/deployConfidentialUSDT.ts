import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  console.log("Deploying ConfidentialUSDT...");
  console.log("Deployer:", deployer);

  const deployed = await deploy("ConfidentialUSDT", {
    from: deployer,
    log: true,
  });

  console.log("ConfidentialUSDT deployed at:", deployed.address);
};

export default func;
func.id = "deploy_confidential_usdt";
func.tags = ["ConfidentialUSDT", "ConfidentialToken"]; 

