import { createPublicClient, createWalletClient, http, parseEther } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import config from "./config.json";

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


const AMOUNT_PER_WALLET = parseEther("0.25");
const PARENT_PK = "";
const parentAccount = privateKeyToAccount(PARENT_PK);

// Create a wallet client for sending transactions
const client = createWalletClient({
  account: parentAccount,
  chain: monad,
  transport: http("https://testnet.x-phere.com")
});

// Create a public client for checking balances
const publicClient = createPublicClient({
  chain: monad,
  transport: http("https://testnet.x-phere.com")
});

async function main() {
    try {
        // Check parent wallet balance
        const parentBalance = await publicClient.getBalance({
            address: parentAccount.address,
        });
        
        const wallets = config.wallets;
        const totalNeeded = parseEther((0.01 * wallets.length).toString());
        
        console.log(`Parent wallet address: ${parentAccount.address}`);
        console.log(`Parent wallet balance: ${parentBalance} wei`);
        console.log(`Total amount needed: ${totalNeeded} wei`);
        console.log(`Number of wallets to fund: ${wallets.length}`);
        
        if (parentBalance < totalNeeded) {
            throw new Error(`Insufficient balance. Need ${totalNeeded} wei but have ${parentBalance} wei`);
        }
        
        console.log("Starting fund distribution...");
        
        for (let i = 0; i < wallets.length; i++) {
            try {
                const wallet = wallets[i];
                let walletBalance = await publicClient.getBalance({
                    address: wallet.address,
                });
                if (walletBalance >= AMOUNT_PER_WALLET) {
                    console.log(`Skipping wallet ${i+1}/${wallets.length}: ${wallet.address} because it has enough balance`);
                    continue;
                }
                console.log(`Sending ${AMOUNT_PER_WALLET} wei to wallet ${i+1}/${wallets.length}: ${wallet.address}`);
                
                const hash = await client.sendTransaction({
                    to: wallet.address,
                    value: AMOUNT_PER_WALLET,
                });
                
                console.log(`Transaction sent with hash: ${hash} || https://xpc.tamsa.io/tx/${hash}`);
                await new Promise(resolve => setTimeout(resolve, 3000));
            } catch (error) {
                console.error(`Error sending transaction to wallet`, error);
            }
        }
        
        console.log("Fund distribution completed successfully!");
    } catch (error) {
        console.error("Error during fund distribution:", error);
    }
}

// Execute the main function
main().catch(console.error);
