import { StacksTestnet } from '@stacks/network';
import {
    AnchorMode,
    PostConditionMode,
    TransactionVersion,
    broadcastTransaction,
    callReadOnlyFunction,
    createStacksPrivateKey,
    cvToJSON,
    getAddressFromPrivateKey,
    makeContractCall,
    standardPrincipalCV,
    uintCV
} from '@stacks/transactions';

// Configuration
const NETWORK = new StacksTestnet();
const PRIVATE_KEY = 'finish coyote penalty scene please hobby off settle knife else hotel segment leg tornado drama over extra frown endorse blush mammal expire voyage market';
const CONTRACT_ADDRESS = 'ST48Z0HEKRDGKPS5R72NP5JGH29RSWH5NT1DJ0Z4'; // Updated after deployment
const CONTRACT_NAME = 'reputation-system';

// Helper function to create private key
function getPrivateKey() {
  return createStacksPrivateKey(PRIVATE_KEY);
}

// Helper function to get sender address
function getSenderAddress() {
  const privateKey = getPrivateKey();
  return getAddressFromPrivateKey(privateKey.data, TransactionVersion.Testnet);
}

// Rate a user
async function rateUser(targetAddress: string, rating: number) {
  try {
    console.log(`🌟 Rating user ${targetAddress} with ${rating} stars...`);
    
    const privateKey = getPrivateKey();
    
    const txOptions = {
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'rate-user',
      functionArgs: [
        standardPrincipalCV(targetAddress),
        uintCV(rating)
      ],
      senderKey: PRIVATE_KEY,
      network: NETWORK,
      anchorMode: AnchorMode.Any,
      postConditionMode: PostConditionMode.Allow,
      fee: 5000n,
    };

    const transaction = await makeContractCall(txOptions);
    const broadcastResponse = await broadcastTransaction(transaction, NETWORK);
    
    if (broadcastResponse.error) {
      console.error('❌ Transaction failed:', broadcastResponse.error);
      return;
    }
    
    console.log('✅ Rating submitted successfully!');
    console.log(`🔗 Transaction ID: ${broadcastResponse.txid}`);
    console.log(`🌐 View on explorer: https://explorer.stacks.co/txid/${broadcastResponse.txid}?chain=testnet`);
    
  } catch (error) {
    console.error('❌ Error rating user:', error);
  }
}

// Get user reputation
async function getUserReputation(userAddress: string) {
  try {
    console.log(`📊 Getting reputation for ${userAddress}...`);
    
    const result = await callReadOnlyFunction({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'get-reputation',
      functionArgs: [standardPrincipalCV(userAddress)],
      network: NETWORK,
      senderAddress: getSenderAddress(),
    });
    
    const reputation = cvToJSON(result).value;
    console.log(`⭐ Reputation: ${reputation}/5`);
    
    return reputation;
  } catch (error) {
    console.error('❌ Error getting reputation:', error);
  }
}

// Get reputation details
async function getReputationDetails(userAddress: string) {
  try {
    console.log(`📈 Getting detailed reputation for ${userAddress}...`);
    
    const result = await callReadOnlyFunction({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'get-reputation-details',
      functionArgs: [standardPrincipalCV(userAddress)],
      network: NETWORK,
      senderAddress: getSenderAddress(),
    });
    
    const details = cvToJSON(result).value;
    console.log(`📊 Total Score: ${details['total-score'].value}`);
    console.log(`🔢 Rating Count: ${details['rating-count'].value}`);
    
    if (details['rating-count'].value > 0) {
      const avgRating = details['total-score'].value / details['rating-count'].value;
      console.log(`⭐ Average Rating: ${avgRating.toFixed(2)}/5`);
    }
    
    return details;
  } catch (error) {
    console.error('❌ Error getting reputation details:', error);
  }
}

// Check if user has rated another user
async function hasRated(raterAddress: string, targetAddress: string) {
  try {
    console.log(`🔍 Checking if ${raterAddress} has rated ${targetAddress}...`);
    
    const result = await callReadOnlyFunction({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'has-rated',
      functionArgs: [
        standardPrincipalCV(raterAddress),
        standardPrincipalCV(targetAddress)
      ],
      network: NETWORK,
      senderAddress: getSenderAddress(),
    });
    
    const hasRatedResult = cvToJSON(result).value;
    console.log(`✅ Has rated: ${hasRatedResult}`);
    
    return hasRatedResult;
  } catch (error) {
    console.error('❌ Error checking rating status:', error);
  }
}

// Get contract statistics
async function getContractStats() {
  try {
    console.log('📊 Getting contract statistics...');
    
    const result = await callReadOnlyFunction({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'get-contract-stats',
      functionArgs: [],
      network: NETWORK,
      senderAddress: getSenderAddress(),
    });
    
    const stats = cvToJSON(result).value;
    console.log(`📈 Total Ratings: ${stats['total-ratings'].value}`);
    console.log(`👥 Total Users: ${stats['total-users'].value}`);
    
    return stats;
  } catch (error) {
    console.error('❌ Error getting contract stats:', error);
  }
}

// Demo function
async function runDemo() {
  console.log('🎮 Starting Reputation System Demo...\n');
  
  const senderAddress = getSenderAddress();
  console.log(`👤 Your address: ${senderAddress}\n`);
  
  // Example addresses for demo
  const bobAddress = 'ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5';
  const aliceAddress = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG';
  
  try {
    // 1. Get initial contract stats
    console.log('1️⃣ Initial Contract Statistics:');
    await getContractStats();
    console.log('');
    
    // 2. Check if we've already rated Bob
    console.log('2️⃣ Checking rating status:');
    await hasRated(senderAddress, bobAddress);
    console.log('');
    
    // 3. Get Bob's current reputation
    console.log('3️⃣ Bob\'s current reputation:');
    await getReputationDetails(bobAddress);
    console.log('');
    
    // 4. Rate Bob (uncomment to actually rate)
    // console.log('4️⃣ Rating Bob with 5 stars:');
    // await rateUser(bobAddress, 5);
    // console.log('');
    
    console.log('✅ Demo completed! Uncomment the rating section to actually submit a rating.');
    
  } catch (error) {
    console.error('❌ Demo error:', error);
  }
}

// Command line interface
const args = process.argv.slice(2);
const command = args[0];

switch (command) {
  case 'rate':
    if (args.length < 3) {
      console.log('Usage: npm run interact rate <address> <rating>');
      break;
    }
    rateUser(args[1], parseInt(args[2]));
    break;
    
  case 'reputation':
    if (args.length < 2) {
      console.log('Usage: npm run interact reputation <address>');
      break;
    }
    getUserReputation(args[1]);
    break;
    
  case 'details':
    if (args.length < 2) {
      console.log('Usage: npm run interact details <address>');
      break;
    }
    getReputationDetails(args[1]);
    break;
    
  case 'check':
    if (args.length < 3) {
      console.log('Usage: npm run interact check <rater-address> <target-address>');
      break;
    }
    hasRated(args[1], args[2]);
    break;
    
  case 'stats':
    getContractStats();
    break;
    
  case 'demo':
  default:
    runDemo();
    break;
}

export {
    getContractStats, getReputationDetails, getUserReputation, hasRated, rateUser
};

