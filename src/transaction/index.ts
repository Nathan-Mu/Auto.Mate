import { Bank, RecordCategory, RecordType } from './config.js';
import {
  getBankNameByProvider,
  isExternalTransfer,
  isInternalTransfer,
  isPaidInterest,
  isReceivedRepayment,
  isRepayingCreditCard,
  isTransferToMyself,
  readTransactions,
  temp_isCorrect,
} from './utils.js';

export default async function processTransactions() {
  const records = [];
  const transactions = await readTransactions('sample-30days.csv');
  const [transfers, others] = transactions
    .filter((transaction) => !isInternalTransfer(transaction))
    .filter((transaction) => !isReceivedRepayment(transaction))
    .reduce(
      ([t, o], transaction) =>
        isExternalTransfer(transaction)
          ? [[...t, transaction], o]
          : [t, [...o, transaction]],
      [[], []],
    );

  const [transfersWithinMyself, transfersWithOthers] = transfers
    .sort((a, b) => Number(a.transaction_id) - Number(b.transaction_id))
    .reduce(
      ([withMyself, withOthers], transaction) =>
        isTransferToMyself(transaction)
          ? [[...withMyself, transaction], withOthers]
          : [withMyself, [...withOthers, transaction]],
      [[], []],
    );

  transfersWithinMyself
    .filter((transaction) => Number(transaction.amount) < 0)
    .forEach((transaction) => {
      const bank = getBankNameByProvider(transaction.provider_name);
      records.push({
        date: transaction.transaction_date,
        amount: Math.abs(Number(transaction.amount)),
        merchant: transaction.merchant_name,
        bank,
        from: bank,
        type: RecordType.Transfer,
        to: bank === Bank.CBA ? Bank.ANZ : Bank.CBA,
        category: RecordCategory.Transfer,
        'Correct?': temp_isCorrect(transaction, 'between_bank_transfer'),
      });
    });

  const paymentsAndIncomes = [...others, ...transfersWithOthers];

  paymentsAndIncomes.map((transaction) => {
    if (isPaidInterest(transaction)) {
      return {
        date: transaction.transaction_date,
        bank: getBankNameByProvider(transaction.provider_name),
        amount: Math.abs(Number(transaction.amount)),
        type: RecordType.In,
        merchant: transaction.merchant_name,
        category: RecordCategory.Interest,
        'Correct?': temp_isCorrect(transaction, 'interest'),
      };
    }
    if (isRepayingCreditCard(transaction)) {
      const bank = getBankNameByProvider(transaction.provider_name);
      return {
        date: transaction.transaction_date,
        bank,
        from: bank,
        to: 'AMEX',
        amount: Math.abs(Number(transaction.amount)),
        type: RecordCategory.Transfer,
        merchant: transaction.merchant_name,
        category: RecordCategory.CreditCardRepayment,
        'Correct?': temp_isCorrect(transaction, 'credit_repayment'),
      };
    }
    if (transaction.temp_category === 'payment') return;
    return transaction;
  });
  // console.log(
  //   'Transfer transactions:',
  //   activeTransactions
  //     .filter(Boolean)
  //     .filter((item) => item['Correct?'] !== 'yes'),
  // );
  console.log(records);
}

// todo
// credit card repayment (in & out)
// Transfer between banks
// filter out schedule transactions (like rent, bills, etc)
// interest
// income and payment
