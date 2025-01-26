import { TestBed } from '@angular/core/testing';

import { EtiqueteraService } from './main/curso/service/etiquetera.service';

describe('EtiqueteraService', () => {
  let service: EtiqueteraService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EtiqueteraService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
