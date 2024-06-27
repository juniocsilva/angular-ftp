import { TestBed, inject } from '@angular/core/testing';

import { AlertMessageService } from './alert-message.service';

describe('AlertMessageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AlertMessageService]
    });
  });

  it('should be created', inject([AlertMessageService], (service: AlertMessageService) => {
    expect(service).toBeTruthy();
  }));
});
