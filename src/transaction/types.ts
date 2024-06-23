export interface Transaction {
  transaction_id?: string;
  description?: string;
  amount?: string;
  transaction_date?: string;
  account_number?: string;
  account_name?: string;
  credit_debit?: string;
  transaction_type?: string;
  provider_name?: string;
  merchant_name?: string;
}
