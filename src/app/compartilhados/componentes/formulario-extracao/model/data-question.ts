import { QuestionBase } from './question-base';

export class DataQuestion extends QuestionBase<string> {
  controlType = 'data';
  type: string;

  constructor(options: {} = {}) {
    super(options);
    this.type = options['type'] || '';
  }
}