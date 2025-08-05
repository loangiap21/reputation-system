import { StacksTestnet } from '@stacks/network';
import {
    AnchorMode,
    broadcastTransaction,
    createStacksPrivateKey,
    getAddressFromPrivateKey,
    makeContractDeploy,
    PostConditionMode,
    TransactionVersion
} from '@stacks/transactions';
import { readFileSync } from 'fs';
import * as path from 'path';

// Configuration
const NETWORK = new StacksTestnet(); // Change to StacksMainnet() for mainnet
const PRIVATE_KEY = 'finish coyote penalty scene please hobby off settle knife else hotel segment leg tornado drama over extra frown endorse blush mammal expire voyage market'; // Your private key
const CONTRACT_NAME = 'reputation-system';

async function deployContract() {
  try {
    console.log('🚀 Starting deployment...');
    
    // Read contract source
    const contractPath = path.join(process.cwd(), 'contracts', 'reputation-system.clar');
    const contractSource = readFileSync(contractPath, 'utf8');
    
    // Create private key object
    const privateKey = createStacksPrivateKey(PRIVATE_KEY);
    const senderAddress = getAddressFromPrivateKey(privateKey.data, TransactionVersion.Testnet);
    
    console.log(`📝 Deploying from address: ${senderAddress}`);
    console.log(`📄 Contract name: ${CONTRACT_NAME}`);
    
    // Create deployment transaction
    const deployTx = await makeContractDeploy({
      contractName: CONTRACT_NAME,
      codeBody: contractSource,
      senderKey: PRIVATE_KEY,
      network: NETWORK,
      anchorMode: AnchorMode.Any,
      postConditionMode: PostConditionMode.Allow,
      fee: 10000n, // 0.01 STX fee
    });
    
    console.log('📡 Broadcasting transaction...');
    
    // Broadcast transaction
    const broadcastResponse = await broadcastTransaction(deployTx, NETWORK);
    
    if (broadcastResponse.error) {
      console.error('❌ Deployment failed:', broadcastResponse.error);
      console.error('Reason:', broadcastResponse.reason);
      return;
    }
    
    console.log('✅ Transaction broadcasted successfully!');
    console.log(`🔗 Transaction ID: ${broadcastResponse.txid}`);
    console.log(`🌐 View on explorer: https://explorer.stacks.co/txid/${broadcastResponse.txid}?chain=testnet`);
    
    // Contract address will be: senderAddress.contractName
    const contractAddress = `${senderAddress}.${CONTRACT_NAME}`;
    console.log(`📋 Contract Address: ${contractAddress}`);
    
    // Save contract address to file
    const fs = require('fs');
    fs.writeFileSync(
      path.join(process.cwd(), 'contract-address.txt'),
      `Contract Address: ${contractAddress}\nTransaction ID: ${broadcastResponse.txid}\nNetwork: Testnet\nDeployed: ${new Date().toISOString()}`
    );
    
    console.log('💾 Contract address saved to contract-address.txt');
    
    // Wait for confirmation
    console.log('⏳ Waiting for transaction confirmation...');
    console.log('   This may take a few minutes. Check the explorer link above for status.');
    
  } catch (error) {
    console.error('❌ Deployment error:', error);
  }
}

// Run deployment
deployContract();
