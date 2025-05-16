import { createPublicClient, createWalletClient, http, parseEther, getContract } from "viem";
import {monadTestnet} from "viem/chains";
import { privateKeyToAccount } from 'viem/accounts'
import fs from 'fs';
import ChainSocialABI from "../abis/ChainSocial.json";
const CHAIN_SOCIAL_ADDRESS = '0x17E81bE1e4FD51332C6B09e16B4AB83Bf5a633D2'

let monad = {
    id: 1998991,
    name: "XPhere",
    nativeCurrency: {
      name: "XPhere",
      symbol: "XPHERE",
      decimals: 18
    },
    rpcUrls: {
      default: {
        http: ["https://testnet.x-phere.com"],
        webSocket: ["wss://testnet.x-phere.com/ws	"]
      }
    },
    blockExplorers: {
        default: {
          name: "XPhere Explorer",
          url: "https://testnet.x-phere.com/"
        }
      },
      testnet: true
    };

const client = createWalletClient({
    chain: monad,
    transport: http("https://testnet.x-phere.com")
  });
  
  // Create a public client for checking balances
const publicClient = createPublicClient({
  chain: monad,
  transport: http("https://testnet.x-phere.com")
});
async function createPost(tweet, wallet) {
    if (wallet.private_key.startsWith("0x")) {
        wallet.private_key = wallet.private_key.slice(2);
    }
    let acc = privateKeyToAccount("0x" + wallet.private_key);
    try {
        let simulate = await publicClient.estimateContractGas({
            address: CHAIN_SOCIAL_ADDRESS,
            abi: ChainSocialABI,
            functionName: "createPost",
            args: [tweet],
            account: acc,
            gasPrice: 52000000000
        })
        // console.log(simulate);
        // return;
        let simulationGas = simulate.gas;
        const hash = await client.writeContract({
            address: CHAIN_SOCIAL_ADDRESS,
            abi: ChainSocialABI,
            functionName: "createPost",
            args: [tweet],
            account: acc,
            gas: simulate

        });

        const receipt = await publicClient.waitForTransactionReceipt({ hash });
        if (receipt.status === "success") {
            console.log(`Post created for ${wallet.address} || txn: https://xpt.tamsa.io/tx/${hash}`);
 
        } else {
            console.error(`Failed to create post for ${wallet.address}`);
            console.error(receipt);
        }
    } catch (error) {
        console.error(`Error creating post for ${wallet.address}: ${error}`);
    }
}
async function main() {
    const wallets = require('./config.json').wallets;
    let tweetsFile = fs.readFileSync('./scripts/filtered_tweets_two.txt', 'utf8');
    const tweets = tweetsFile.split('\n');
    let j = 0
    while (true) {
        for (let i = 0; i < wallets.length; i++) {
            const wallet = wallets[i];
            const tweet = tweets[j];

            console.log(`Creating post for ${wallet.address} with tweet: ${tweet}`);
            await createPost(tweet, wallet);
            console.log(`Waiting 5 seconds...`);
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            console.log(`--------------------------------`);
            console.log(`${j} / ${tweets.length}`);
            j++;
            if (j >= tweets.length) {
                break;
            }

        }
    }
}

main();