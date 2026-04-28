import { TestBed } from '@angular/core/testing';

import { DevTicketService } from './dev-ticket-service';

describe('DevTicketService', () => {
  let service: DevTicketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DevTicketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
