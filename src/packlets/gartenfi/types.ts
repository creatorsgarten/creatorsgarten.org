export interface GartenFiData {
  balances: Record<string, number>
  transactions: Transaction[]
}

export interface Transaction {
  date: string
  account: string
  description: string
  amount: number
}
