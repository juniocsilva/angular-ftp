import { QuestionBase } from './question-base';

export class CpfQuestion extends QuestionBase<string> {
  controlType = 'cpf';
  type: string;

  constructor(options: {} = {}) {
    super(options);
    this.type = options['type'] || '';
  }
}