export function abbreviateAddress(address: string | undefined) {
    return `${address?.substring(0, 5)}...${address?.substring(55)}`;
  }
  
  export function abbreviateTxnId(txnId: string) {
    return `${txnId.substring(0, 5)}...${txnId.substring(62)}`;
  }
  