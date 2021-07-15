import { TestBed } from '@angular/core/testing';

import { AgentMessagesService } from './agent-messages.service';

describe('AgentMessagesService', () => {
  let service: AgentMessagesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AgentMessagesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
