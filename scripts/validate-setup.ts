import fs from "fs";
import path from "path";

async function main() {
  console.log("🔍 验证部署配置...\n");

  let allChecks = true;

  // 检查 .env 文件
  const envPath = path.join(__dirname, "../.env");
  if (fs.existsSync(envPath)) {
    console.log("✅ .env 文件存在");

    const envContent = fs.readFileSync(envPath, 'utf8');
    const hasPrivateKey = envContent.includes('PRIVATE_KEY=') &&
                         envContent.split('PRIVATE_KEY=')[1].split('\n')[0].trim().length > 0;
    const hasInfuraKey = envContent.includes('INFURA_API_KEY=') &&
                        envContent.split('INFURA_API_KEY=')[1].split('\n')[0].trim().length > 0;

    if (hasPrivateKey) {
      console.log("✅ PRIVATE_KEY 已配置");
    } else {
      console.log("❌ PRIVATE_KEY 未配置或为空");
      allChecks = false;
    }

    if (hasInfuraKey) {
      console.log("✅ INFURA_API_KEY 已配置");
    } else {
      console.log("❌ INFURA_API_KEY 未配置或为空");
      allChecks = false;
    }
  } else {
    console.log("❌ .env 文件不存在");
    allChecks = false;
  }

  // 检查合约文件
  const contractFiles = [
    "../contracts/NumberStorage.sol",
    "../contracts/AddressStorage.sol"
  ];

  contractFiles.forEach(file => {
    const contractPath = path.join(__dirname, file);
    if (fs.existsSync(contractPath)) {
      console.log(`✅ ${path.basename(file)} 合约存在`);
    } else {
      console.log(`❌ ${path.basename(file)} 合约不存在`);
      allChecks = false;
    }
  });

  // 检查部署脚本
  const deployScript = path.join(__dirname, "deploy-sepolia.ts");
  if (fs.existsSync(deployScript)) {
    console.log("✅ 部署脚本存在");
  } else {
    console.log("❌ 部署脚本不存在");
    allChecks = false;
  }

  // 检查hardhat配置
  const configPath = path.join(__dirname, "../hardhat.config.ts");
  if (fs.existsSync(configPath)) {
    console.log("✅ Hardhat 配置文件存在");
  } else {
    console.log("❌ Hardhat 配置文件不存在");
    allChecks = false;
  }

  console.log("\n" + "=".repeat(50));

  if (allChecks) {
    console.log("🎉 所有配置检查通过！");
    console.log("\n📋 下一步操作:");
    console.log("1. 确保 .env 文件中的 PRIVATE_KEY 和 INFURA_API_KEY 正确");
    console.log("2. 确保账户有足够的Sepolia ETH (运行: npm run check:balance)");
    console.log("3. 测试网络连接 (运行: npm run test:connection)");
    console.log("4. 部署合约 (运行: npm run deploy:sepolia)");
  } else {
    console.log("❌ 配置不完整，请检查上述问题");
    console.log("\n📋 解决方案:");
    console.log("1. 复制 .env.example 到 .env");
    console.log("2. 在 .env 中填入你的 PRIVATE_KEY 和 INFURA_API_KEY");
    console.log("3. 运行 npm run compile 确保合约编译成功");
  }

  console.log("=".repeat(50));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });