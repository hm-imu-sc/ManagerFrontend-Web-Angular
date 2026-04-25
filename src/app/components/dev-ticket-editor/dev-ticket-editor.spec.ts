import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevTicketEditor } from './dev-ticket-editor';

describe('DevTicketEditor', () => {
  let component: DevTicketEditor;
  let fixture: ComponentFixture<DevTicketEditor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DevTicketEditor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DevTicketEditor);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
