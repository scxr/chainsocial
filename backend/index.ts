import { Elysia } from 'elysia';
import { createPublicClient, http, type Chain } from 'viem';
// Import the blockchain routes
import { blockchainRoutes } from './routes/blockchain';
// Import the ChainSocial routes
import { chainSocialRoutes } from './routes/chainSocial';
import mongoose from 'mongoose';
import { indexerReqsRoutes } from './routes/indexerReqs';
import {swagger} from "@elysiajs/swagger"
import { transactRoutes } from './routes/transact';
try {
  mongoose.connect(process.env.MONGO_URI as string);
} catch (error) {
  console.error('Error connecting to MongoDB:', error);
}

// Define the Monad testnet chain
let monad: Chain = {
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

// Create a global Viem PublicClient instance
export const publicClient = createPublicClient({
  chain: monad,
  transport: http(monad.rpcUrls.default.http[0])
});

// Create an Elysia app
const app = new Elysia()
  .use(swagger({
    documentation: {
      tags: [
        {
          name: 'Blockchain',
          description: 'Blockchain related endpoints'
        },
        {
          name: 'ChainSocial',
          description: 'ChainSocial related endpoints'
        },
        {
          name: 'IndexerReqs',
          description: 'IndexerReqs related endpoints'
        },
        {
          name: 'Transact',
          description: 'Transaction related endpoints'
        }
      ]
    }
  }))
  // .get('/', () => 'Hello from Elysia with Viem!')
  // .get('/block-number', async () => {
  //   const blockNumber = await publicClient.getBlockNumber();
  //   return { blockNumber: blockNumber.toString() };
  // })
  .use(blockchainRoutes)
  .use(chainSocialRoutes)
  .use(indexerReqsRoutes)
  .use(transactRoutes)
  .listen(3000);

console.log(`🦊 Elysia server is running at ${app.server?.hostname}:${app.server?.port}`);