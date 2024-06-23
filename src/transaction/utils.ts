import readCSV from '../readCSV.js';
import {
  INTERNAL_TRANSFER_TYPES,
  TRANSFER_TO_MYSELF_KEYWORD,
  merchantToBank,
  providerToBank,
  whitelist,
} from './config.js';
import { Transaction } from './types.js';

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

export function isReceivedRepayment(transaction) {
  return transaction.description.includes('ONLINE PAYMENT RECEIVED');
}

export function isRepayingCreditCard(transaction) {
  return ['American Express', 'Citibank (Credit Cards)'].includes(
    transaction.merchant_name,
  );
}

export function temp_isCorrect(transaction, assertion) {
  return transaction.temp_category === assertion
    ? 'yes'
    : 'NO!!!!!!!!!!!!!!!!!!!';
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
