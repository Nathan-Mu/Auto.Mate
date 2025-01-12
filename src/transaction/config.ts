export const whitelist = {
  transaction_id: true,
  description: true,
  user_description: false,
  amount: true,
  currency: false,
  transaction_date: true,
  posted_date: false,
  account_number: true,
  account_name: true,
  credit_debit: true,
  transaction_type: true,
  provider_name: true,
  merchant_name: true,
  budget_category: false,
  category_name: false,
  user_tags: false,
  notes: false,
  included: false,
};

export const enum Bank {
  CBA = 'CBA',
  ANZ = 'ANZ Plus',
  AMEX = 'Amex',
  Citi = 'Citi',
  UBank = 'UBank',
  NAB = 'NAB',
  Coles = 'Coles',
}

export const providerToBank = {
  ['American Express']: Bank.AMEX,
  ['ANZ Plus']: Bank.ANZ,
  ['CommBank']: Bank.CBA,
  ['ubank']: Bank.UBank,
  ['NAB']: Bank.NAB,
  ['Coles Financial Services']: Bank.Coles,
};

export const merchantToBank = {
  ['American Express']: Bank.AMEX,
  ['Citibank (Credit Cards)']: Bank.Citi,
};

export enum RecordCategory {
  Transfer = 'Transfer',
  Interest = 'Interest',
  Payment = 'Payment',
  CreditCardRepayment = 'Credit Card Repayment',
  Salary = 'Salary',
  UnknownIncome = 'Unknown Income',
  UnknownPayment = 'Unknown Payment',
}

export enum RecordType {
  In = 'in',
  Out = 'out',
  Transfer = 'transfer',
}

export const INTERNAL_TRANSFER_TYPES = [
  'transfer_incoming',
  'transfer_outgoing',
];

export const scheduledTransactions = [
  {
    keyword: 'Payway Rent & Hire',
    merchant_name: 'Payway',
  },
  // {},
];

// regex
export const TRANSFER_TO_MYSELF_KEYWORD =
  'payment to d z.{2}o|payment to d.{5} z.{2}o|my anz save|my ub save|from d.{5} z.{2}o';
