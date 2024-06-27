import { QuestionBase } from './question-base';

export class SelectSnQuestion extends QuestionBase<string> {
  controlType = 'select_sn';
  options: {key: string, value: string}[] = [];

  constructor(options: {} = {}) {
    super(options);
    this.options = options['options'] || [];
  }
}