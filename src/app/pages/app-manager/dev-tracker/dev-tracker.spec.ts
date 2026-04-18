import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevTracker } from './dev-tracker';

describe('DevTracker', () => {
  let component: DevTracker;
  let fixture: ComponentFixture<DevTracker>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DevTracker]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DevTracker);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
