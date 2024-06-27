import { QuestionBase } from './question-base';

export class TelefoneDDDQuestion extends QuestionBase<string> {
  controlType = 'telefone_ddd';
  type: string;

  constructor(options: {} = {}) {
    super(options);
    this.type = options['type'] || '';
  }
}