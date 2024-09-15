import readCSV from '../readCSV.ts';
import {
  Bank,
  INTERNAL_TRANSFER_TYPES,
  RecordCategory,
  TRANSFER_TO_MYSELF_KEYWORD,
  merchantToBank,
  providerToBank,
  whitelist,
} from './config.ts';
import { Transaction } from './types.ts';

export async function readTransactions(
  fileName: string,
): Promise<Transaction[]> {
  // improvement: remove unnecessary columns
  const records = await readCSV(fileName);
  const title = records[0];
  const transactions = records.slice(1);
  const output = transactions.map((row) => {
    return title.reduce((transaction, key, index) => {
      if (whitelist[key]) {
        transaction[key] = row[index];
      }
      return transaction;
    }, {});
  });
  return output;
}

export function getBankNameByProvider(providerName) {
  return providerToBank[providerName];
}

export function isPaidInterest(transaction) {
  return transaction.transaction_type === 'interest_paid';
}

export function isSalary(transaction) {
  return transaction.description.includes('Salary Nine');
}

export function isReceivedRepayment(transaction) {
  return transaction.description.includes('ONLINE PAYMENT RECEIVED');
}

export function isRepayingCreditCard(transaction) {
  return Object.keys(merchantToBank).includes(transaction.merchant_name);
}

export function getCreditBankNameByMerchantName(merchantName) {
  return merchantToBank[merchantName];
}

export function isExternalTransfer(transaction) {
  return (
    transaction.description.match(/Payment|Transfer/) &&
    transaction.transaction_type !== 'direct_debit'
  );
}

export function isInternalTransfer(transaction) {
  return INTERNAL_TRANSFER_TYPES.includes(transaction.transaction_type);
}

export function isTransferToMyself(transaction) {
  return transaction.description.match(
    new RegExp(TRANSFER_TO_MYSELF_KEYWORD, 'i'),
  );
}

export function getBankNameByMerchantName(merchantName) {
  return merchantToBank[merchantName];
}

export function not(fn) {
  return (...args) => !fn(...args);
}

export function getIncomeCategory(transaction) {
  if (isPaidInterest(transaction)) {
    return RecordCategory.Interest;
  }
  if (isSalary(transaction)) {
    return RecordCategory.Salary;
  }
  return RecordCategory.UnknownIncome;
}

export function getPaymentCategory(transaction) {
  if (isRepayingCreditCard(transaction)) {
    return RecordCategory.CreditCardRepayment;
  }
  return RecordCategory.UnknownPayment;
}

export function getInternalTransferReceiver(description) {
  if (description.match(new RegExp('Payment to D Zhao', 'i'))) {
    return Bank.CBA;
  } else if (description.match(new RegExp('Payment to DONGYU ZHAO|MY ANZ SAVE', 'i'))) {
    return Bank.ANZ;
  } else if (description.match(new RegExp('My Ub Save', 'i'))) {
    return Bank.UBank;
  }
}