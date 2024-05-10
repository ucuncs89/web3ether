import "dotenv/config";

export abstract class AppConfig {
	static PRIVATE_KEY = String(process.env.PRIVATE_KEY);
	static WALLET_ADDRESS = String(process.env.WALLET_ADDRESS);
	static RPC_TESTNET = String(process.env.RPC_TESTNET);
	static ROUTER_ADDRESS = String(process.env.ROUTER_ADDRESS);
}
