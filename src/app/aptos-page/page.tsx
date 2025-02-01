"use client";
import {
  AccountAddress,
  Aptos,
  AptosConfig,
  Network,
  
} from "@aptos-labs/ts-sdk";
import { useAptosWallet } from "@razorlabs/wallet-kit";

// 100 MOVE
const TRANSFER_AMOUNT = 10000000000;
const gameFundAddress="0xb36ad41b9e9f33a62ea487f50b75bc1f9e169e40c1d3a6c5672a04248e68702d"
type Coin = { coin: { value: string } };


// Setup the client
const config = new AptosConfig({
  network: Network.CUSTOM,
  fullnode: 'https://aptos.testnet.porto.movementlabs.xyz/v1',
  faucet: 'https://fund.testnet.porto.movementlabs.xyz/',
  indexer: "https://indexer.testnet.porto.movementnetwork.xyz/v1/graphql",
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
