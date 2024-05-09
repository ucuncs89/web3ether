import { ethers } from "ethers";

// Set up provider
const provider = new ethers.JsonRpcProvider("https://sepolia.base.org");

// Load Uniswap's testnet Router contract ABI
import { abi } from "./abi";

async function swapTokens(
  tokenIn: string,
  tokenOut: string,
  amountIn: string,
  amountOutMin: string,
  privateKey: string
) {
  const wallet = new ethers.Wallet(privateKey, provider);
  const account = await wallet.getAddress();
  const deadline = Math.floor(Date.now() / 1000) + 60 * 10; // 10 minutes from now

  // Set up Uniswap Router contract instance
  const uniswapRouterContract = new ethers.Contract(
    "0x4752ba5dbc23f44d87826276bf6fd6b1c372ad24",
    abi,
    wallet
  );

  // Set up transaction parameters
  const path = [tokenIn, tokenOut]; // Token swap path

  try {
    // Execute the swap transaction
    const result = await uniswapRouterContract.swapExactTokensForTokens(
      ethers.parseUnits(amountIn, "ether"),
      ethers.parseUnits(amountOutMin, "ether"),
      path,
      account,
      deadline,
      { gasLimit: 300000 } // Adjust gas limit as needed
    );

    console.log(result);
  } catch (error) {
    console.error("Error executing swap:", error);
  }
}

// Usage
const tokenIn = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"; // Token to swap from (ETH on Ropsten)
const tokenOut = "0x87C51CD469A0E1E2aF0e0e597fD88D9Ae4BaA967"; // Token to receive (e.g., DAI on Ropsten)
const amountIn = "0.0001"; // Amount of tokenIn (ETH) to swap
const amountOutMin = "0.0001"; // Minimum amount of tokenOut to receive (slippage tolerance)
const privateKey =
  "dc286a9e44243efab134851948a06b9b02a0a859686ba88032dd79b086b64d43"; // Private key of your Ethereum account

swapTokens(tokenIn, tokenOut, amountIn, amountOutMin, privateKey);
