import { QuestionBase } from './question-base';

export class CnpjQuestion extends QuestionBase<string> {
  controlType = 'cnpj';
  type: string;

  constructor(options: {} = {}) {
    super(options);
    this.type = options['type'] || '';
  }
}