import { Contract, JsonRpcProvider, Wallet, parseEther } from "ethers";
import uniswapV2RouterABI from "../abi/routerUniswapV2ABI.json";
import { ParamsSwapV2 } from "../interface";
import { AppConfig } from "../configs";

const { ROUTER_ADDRESS } = AppConfig;

export class Swap {
	private privateKey: string;
	private provider: JsonRpcProvider;

	constructor(privateKey: string, provider: JsonRpcProvider) {
		this.privateKey = privateKey;
		this.provider = provider;
	}

	async swapOnUniswapV2({
		amountIn,
		tokenAddress,
		reverse = false,
	}: ParamsSwapV2) {
		const wallet = new Wallet(this.privateKey, this.provider);

		// Create contract instance
		const uniswapV2Router = new Contract(
			ROUTER_ADDRESS,
			uniswapV2RouterABI,
			wallet
		);

		const AMOUNT_OUT_MIN = 0;
		const TOKEN_ADDRESS = tokenAddress;
		const AMOUNT_IN = parseEther(amountIn);
		const DEADLINE = Math.floor(Date.now() / 1000) + 60 * 10; // 10 minutes from now

		try {
			const tx = await uniswapV2Router.swapExactETHForTokens(
				AMOUNT_OUT_MIN,
				["0x4200000000000000000000000000000000000006", TOKEN_ADDRESS],
				wallet.address,
				DEADLINE,
				{ value: AMOUNT_IN, gasLimit: 400000 }
			);
			console.log("Swap Transaction Hash:", tx.hash);
		} catch (error) {
			console.error("Error:", error);
		}
	}
}
