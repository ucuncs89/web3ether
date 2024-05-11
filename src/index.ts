import { JsonRpcProvider } from "ethers";
import { AppConfig } from "./configs";
import { Swap } from "./libs";
import { Account } from "./libs/account";

const { RPC_TESTNET, PRIVATE_KEY } = AppConfig;

const provider = new JsonRpcProvider(RPC_TESTNET);
const swap = new Swap(PRIVATE_KEY, provider);
const account = new Account(PRIVATE_KEY, provider);

const main = async () => {
	// Get balance Account
	// account.getAccountBalance();
	// Basic Implementation
	// await swap.swapTokenOnUniswapV2({
	// 	amountIn: "0.1",
	// 	tokenAddress: "0x036CbD53842c5426634e7929541eC2318f3dCF7e", // address of the token you want to swap
	// });

	account.getAccountBalance();
	account.getTokenBalance("0x036CbD53842c5426634e7929541eC2318f3dCF7e");
};

main();
