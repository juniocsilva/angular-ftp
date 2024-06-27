import { QuestionBase } from './question-base';

export class EmailQuestion extends QuestionBase<string> {
  controlType = 'email';
  type: string;

  constructor(options: {} = {}) {
    super(options);
    this.type = options['type'] || '';
  }
}