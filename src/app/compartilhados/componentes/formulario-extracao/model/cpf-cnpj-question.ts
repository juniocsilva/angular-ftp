import { QuestionBase } from './question-base';

export class CpfCnpjQuestion extends QuestionBase<string> {
  controlType = 'cpfcnpj';
  type: string;

  constructor(options: {} = {}) {
    super(options);
    this.type = options['type'] || '';
  }
}