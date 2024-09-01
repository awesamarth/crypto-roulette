"use client";
import {
  Account,
  AccountAddress,
  Aptos,
  APTOS_COIN,
  AptosConfig,
  Network,
  NetworkToNetworkName,
  StructTag,
  TypeTagSigner,
  TypeTagStruct,
  
  
} from "@aptos-labs/ts-sdk";
import { useAptosWallet } from "@razorlabs/wallet-kit";

// 100 MOVE
const TRANSFER_AMOUNT = 10000000000;
const gameFundAddress="0x851cfbe389013be02c0c7ecec6f05459be7be20681a311ed96fbff45f2a81c14"
type Coin = { coin: { value: string } };


// Setup the client
const config = new AptosConfig({
  network: Network.CUSTOM,
  fullnode: "https://aptos.testnet.suzuka.movementlabs.xyz/v1",
  faucet: "https://faucet.testnet.suzuka.movementlabs.xyz",
  indexer: "https://indexer.testnet.suzuka.movementlabs.xyz/v1/graphql",
});





