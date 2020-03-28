import { TestBed } from '@angular/core/testing';

import { CloudFunctionServiceService } from './cloud-function-service.service';

describe('CloudFunctionServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CloudFunctionServiceService = TestBed.get(CloudFunctionServiceService);
    expect(service).toBeTruthy();
  });
});
