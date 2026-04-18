import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Temporary } from './temporary';

describe('Temporary', () => {
  let component: Temporary;
  let fixture: ComponentFixture<Temporary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Temporary]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Temporary);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
