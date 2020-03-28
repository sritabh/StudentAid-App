import { TestBed } from '@angular/core/testing';

import { HandlerService } from './handler.service';

describe('HandlerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HandlerService = TestBed.get(HandlerService);
    expect(service).toBeTruthy();
  });
});
