import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionChooser } from './option-chooser';

describe('OptionChooser', () => {
  let component: OptionChooser;
  let fixture: ComponentFixture<OptionChooser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OptionChooser]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OptionChooser);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
