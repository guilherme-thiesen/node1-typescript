import { uuid } from 'uuidv4';
import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface CreateTransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

interface ListTransactionDTO {
  transactions: Transaction[];
  balance: Balance;
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): ListTransactionDTO {
    const balance = this.getBalance();
    const transactions = {
      transactions: this.transactions,
      balance,
    };

    return transactions;
  }

  public getBalance(): Balance {
    const parcialBalance = this.transactions.reduce(
      (prev, elem) => {
        // eslint-disable-next-line no-param-reassign
        prev[elem.type] += elem.value * 1;
        return prev;
      },
      {
        income: 0,
        outcome: 0,
      },
    );

    const { income, outcome } = parcialBalance;
    const total = income - outcome;

    const balance: Balance = {
      income,
      outcome,
      total,
    };

    return balance;
  }

  public create({ title, value, type }: CreateTransactionDTO): Transaction {
    const transaction = { id: uuid(), title, value, type };
    this.transactions.push(transaction);

    return transaction;
  }
}

export default TransactionsRepository;
