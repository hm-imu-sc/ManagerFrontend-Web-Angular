import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevTicketCard } from './dev-ticket-card';

describe('DevTicketCard', () => {
  let component: DevTicketCard;
  let fixture: ComponentFixture<DevTicketCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DevTicketCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DevTicketCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
