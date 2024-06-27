import { QuestionBase } from './question-base';

export class SelectVfQuestion extends QuestionBase<string> {
  controlType = 'select_vf';
  options: {key: string, value: string}[] = [];

  constructor(options: {} = {}) {
    super(options);
    this.options = options['options'] || [];
  }
}