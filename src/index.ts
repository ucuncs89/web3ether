import { JsonRpcProvider } from "ethers";
import { AppConfig } from "./configs";
import { Swap } from "./libs";

const { RPC_TESTNET, PRIVATE_KEY } = AppConfig;

const provider = new JsonRpcProvider(RPC_TESTNET);
const swap = new Swap(PRIVATE_KEY, provider);

const main = async () => {
	// Basic Implementation
	await swap.swapOnUniswapV2({
		amountIn: "0.001",
		tokenAddress: "", // address of the token you want to swap
	});
};

main();
