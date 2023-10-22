import { TestBed } from '@angular/core/testing';

import { TilesService } from './tiles.service';

describe('TilesService', () => {
  let service: TilesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TilesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
