import {
	Contract,
	JsonRpcProvider,
	Wallet,
	formatEther,
	formatUnits,
} from "ethers";
import { AppConfig } from "../configs";

const { WALLET_ADDRESS } = AppConfig;

export class Account {
	private privateKey: string;
	private provider: JsonRpcProvider;

	constructor(privateKey: string, provider: JsonRpcProvider) {
		this.privateKey = privateKey;
		this.provider = provider;
	}

	async getAccountBalance() {
		const wallet = new Wallet(this.privateKey, this.provider);

		try {
			const balance = await this.provider.getBalance(wallet.address);
			console.log(`ETH: ${formatEther(balance)}`);
		} catch (error) {
			console.log(error);
		}
	}

	async getTokenBalance(contractAddress: string) {
		const abi = [
			"function balanceOf(address) view returns (uint256)",
			"function symbol() view returns (string)",
			"function decimals() view returns (uint8)",
		];

		const contract = new Contract(contractAddress, abi, this.provider);

		try {
			const symbol = await contract.symbol();
			const balance = await contract.balanceOf(WALLET_ADDRESS);
			const decimals = await contract.decimals();
			const formattedBalance = formatUnits(balance, decimals);
			console.log(`${symbol}: ${formattedBalance}`);
		} catch (error) {
			console.error("Terjadi kesalahan:", error);
		}
	}
}
