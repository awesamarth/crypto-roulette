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



const movement = new Aptos(config);

/**
 * Prints the balance of an account
 * @param aptos
 * @param name
 * @param address
 * @returns {Promise<number>}
 *
 */
const balance = async (
  name: string,
  accountAddress: AccountAddress,
  versionToWaitFor?: bigint
): Promise<number> => {
  // const amount = await aptos.getAccountAPTAmount({
  //   accountAddress,
  //   minimumLedgerVersion: versionToWaitFor,
  // });
  // console.log(`${name}'s balance is: ${amount}`);
  const amount = 2;
  return amount;
};

export default function AptosPageTest() {
  const {address, account} = useAptosWallet();
  
  
  
  const {signAndSubmitTransaction} = useAptosWallet()

  console.log(address);
  const example = async () => {
    const resource = await movement.getAccountResource<Coin>({
      accountAddress:
        address!,
      resourceType: "0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>",
    });

    // Now you have access to the response type property
    const value = resource.coin.value;

    const transaction = await movement.transferCoinTransaction({
      sender: address!,
      recipient: gameFundAddress,
      amount: TRANSFER_AMOUNT,
    });

    console.log(transaction)

    const pendingTxn = await signAndSubmitTransaction({
      
      // transaction


      payload:{ function:"0x1::aptos_account::transfer", 

      functionArguments:[ gameFundAddress, TRANSFER_AMOUNT], 
      
      
    
    }

    });

    console.log(pendingTxn)

    console.log(value);

    // Create two accounts

    // Fund the accounts

  
    // Bob should have the transfer amount
  };

  return (
    <div>
      <div>henlo there</div>
      <button onClick={example}>click here boye</button>
    </div>
  );
}
