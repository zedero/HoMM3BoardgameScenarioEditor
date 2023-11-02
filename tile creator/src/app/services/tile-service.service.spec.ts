import { TestBed } from '@angular/core/testing';

import { TileServiceService } from './tile-service.service';

describe('TileServiceService', () => {
  let service: TileServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TileServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
