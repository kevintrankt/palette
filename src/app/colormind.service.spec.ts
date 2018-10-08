import { TestBed, inject } from '@angular/core/testing';

import { ColormindService } from './colormind.service';

describe('ColormindService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ColormindService]
    });
  });

  it('should be created', inject([ColormindService], (service: ColormindService) => {
    expect(service).toBeTruthy();
  }));
});
