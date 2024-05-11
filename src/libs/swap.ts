import {
	Contract,
	JsonRpcProvider,
	Wallet,
	parseEther,
	parseUnits,
} from "ethers";
import { ParamsSwapV2 } from "../interface";
import { AppConfig } from "../configs";

// ABI
import uniswapV2RouterABI from "../abi/routerUniswapV2ABI.json";

const { ROUTER_ADDRESS } = AppConfig;

export class Swap {
	private privateKey: string;
	private provider: JsonRpcProvider;

	constructor(privateKey: string, provider: JsonRpcProvider) {
		this.privateKey = privateKey;
		this.provider = provider;
	}

	async swapEthOnUniswapV2({ amountIn, tokenAddress }: ParamsSwapV2) {
		const wallet = new Wallet(this.privateKey, this.provider);

		// Create contract instance
		const uniswapV2Router = new Contract(
			ROUTER_ADDRESS,
			uniswapV2RouterABI,
			wallet
		);

		const AMOUNT_OUT_MIN = 0;
		const AMOUNT_IN = parseEther(amountIn);
		const DEADLINE = Math.floor(Date.now() / 1000) + 60 * 10; // 10 minutes from now
		const path = ["0x4200000000000000000000000000000000000006", tokenAddress];

		try {
			const tx = await uniswapV2Router.swapExactETHForTokens(
				AMOUNT_OUT_MIN,
				path,
				wallet.address,
				DEADLINE,
				{ value: AMOUNT_IN, gasLimit: 400000 }
			);
			console.log("Swap Transaction Hash:", tx.hash);
		} catch (error) {
			console.error("Error:", error);
		}
	}

	async swapTokenOnUniswapV2({ amountIn, tokenAddress }: ParamsSwapV2) {
		await this.approveToken(tokenAddress, amountIn);
		const wallet = new Wallet(this.privateKey, this.provider);
		const contract = new Contract(ROUTER_ADDRESS, uniswapV2RouterABI, wallet);
		const AMOUNT_IN = parseUnits(amountIn, 6);
		const DEADLINE = Math.floor(Date.now() / 1000) + 60 * 10; // 10 minutes from now

		const path = [tokenAddress, "0x4200000000000000000000000000000000000006"];

		try {
			const tx = await contract.swapExactTokensForETH(
				AMOUNT_IN,
				0,
				path,
				wallet.address,
				DEADLINE,
				{
					gasLimit: 200000,
				}
			);

			await tx.wait();

			console.log("Swap berhasil! Token telah ditukarkan kembali menjadi ETH.");
		} catch (error) {}
	}

	async approveToken(tokenAddress: string, amount: any) {
		const wallet = new Wallet(this.privateKey, this.provider);
		try {
			const tokenContract = new Contract(
				tokenAddress,
				["function approve(address spender, uint256 amount)"],
				wallet
			);

			const tx = await tokenContract.approve(
				ROUTER_ADDRESS,
				parseUnits(amount)
			);
			await tx.wait();

			console.log("Approval berhasil!");
		} catch (error) {
			console.error("Terjadi kesalahan saat melakukan approval:", error);
		}
	}
}
