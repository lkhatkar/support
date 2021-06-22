import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportChatAdminComponent } from './support-chat-admin.component';

describe('SupportChatAdminComponent', () => {
  let component: SupportChatAdminComponent;
  let fixture: ComponentFixture<SupportChatAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupportChatAdminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportChatAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
