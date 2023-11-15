import { TestBed } from '@angular/core/testing';

import { RandomMapGenerationService } from './random-map-generation.service';

describe('RandomMapGenerationService', () => {
  let service: RandomMapGenerationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RandomMapGenerationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
