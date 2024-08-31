import { Bank, RecordCategory, RecordType } from './config.ts';
import {
  getBankNameByProvider,
  getCreditBankNameByMerchantName,
  getIncomeCategory,
  getPaymentCategory,
  isExternalTransfer,
  isInternalTransfer,
  isReceivedRepayment,
  isRepayingCreditCard,
  isTransferToMyself,
  not,
  readTransactions,
} from './utils.ts';

function splitRawTransactions(rawTransactions) {
  const [rawTransfers, others] = rawTransactions
    .filter(not(isInternalTransfer))
    .filter(not(isReceivedRepayment))
    .reduce(
      ([t, o], transaction) =>
        isExternalTransfer(transaction)
          ? [[...t, transaction], o]
          : [t, [...o, transaction]],
      [[], []],
    );

  const [transfersWithMyself, transfersWithOthers] = rawTransfers
    .sort((a, b) => Number(a.transaction_id) - Number(b.transaction_id))
    .reduce(
      ([withMyself, withOthers], transaction) =>
        isTransferToMyself(transaction)
          ? [[...withMyself, transaction], withOthers]
          : [withMyself, [...withOthers, transaction]],
      [[], []],
    );

  const paymentsAndIncome = [...others, ...transfersWithOthers];

  const [payments, income] = paymentsAndIncome.reduce(
    ([p, i], transaction) =>
      Number(transaction.amount) > 0
        ? [p, [...i, transaction]]
        : [[...p, transaction], i],
    [[], []],
  );

  return {
    transfers: transfersWithMyself,
    payments,
    income,
  };
}

export default async function processTransactions(filename: string) {
  const records = [];
  const transactions = await readTransactions(filename);

  const { transfers, payments, income } = splitRawTransactions(transactions);

  transfers
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
        // todo: handle more than 2 banks
        to: bank === Bank.CBA ? Bank.ANZ : Bank.CBA,
        category: RecordCategory.Transfer,
      });
    });

  income.forEach((transaction) => {
    const category = getIncomeCategory(transaction);
    records.push({
      date: transaction.transaction_date,
      bank: getBankNameByProvider(transaction.provider_name),
      amount: Math.abs(Number(transaction.amount)),
      type: RecordType.In,
      merchant: transaction.merchant_name,
      description: transaction.description,
      category,
    });
  });

  payments.map((transaction) => {
    const category = getPaymentCategory(transaction);
    const bank = getBankNameByProvider(transaction.provider_name);
    if (isRepayingCreditCard(transaction)) {
      const to = getCreditBankNameByMerchantName(transaction.merchant_name);
      records.push({
        date: transaction.transaction_date,
        bank,
        from: bank,
        to,
        amount: Math.abs(Number(transaction.amount)),
        type: RecordType.Transfer,
        merchant: transaction.merchant_name,
        description: transaction.description,
        category: RecordCategory.CreditCardRepayment,
      });
    } else {
      records.push({
        date: transaction.transaction_date,
        bank,
        amount: Math.abs(Number(transaction.amount)),
        type: RecordType.Out,
        merchant: transaction.merchant_name,
        description: transaction.description,
        category,
      });
    }
  });
  console.table(records);
  return records;
}
