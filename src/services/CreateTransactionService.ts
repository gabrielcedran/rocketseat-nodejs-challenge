import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

interface RequestDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class CreateTransactionService {
  private transactionsRepository: TransactionsRepository;

  constructor(transactionsRepository: TransactionsRepository) {
    this.transactionsRepository = transactionsRepository;
  }

  public execute({ title, value, type }: RequestDTO): Transaction {
    if (!title || title.length <= 0) {
      throw Error('Title is mandatory');
    }

    if (!value || value <= 0) {
      throw Error('Value is mandatory');
    }

    if (!type || (type !== 'income' && type !== 'outcome')) {
      throw Error('Type is invalid');
    }

    if (
      type === 'outcome' &&
      this.transactionsRepository.getBalance().total < value
    ) {
      throw Error('No balance available for this transaction');
    }

    return this.transactionsRepository.create({ title, value, type });
  }
}

export default CreateTransactionService;
