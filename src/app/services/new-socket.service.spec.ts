import { TestBed } from '@angular/core/testing';

import { NewSocketService } from './new-socket.service';

describe('NewSocketService', () => {
  let service: NewSocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NewSocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
