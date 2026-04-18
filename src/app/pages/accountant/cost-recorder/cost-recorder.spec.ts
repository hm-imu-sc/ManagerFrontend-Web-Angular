import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CostRecorder } from './cost-recorder';

describe('CostRecorder', () => {
  let component: CostRecorder;
  let fixture: ComponentFixture<CostRecorder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CostRecorder]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CostRecorder);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
