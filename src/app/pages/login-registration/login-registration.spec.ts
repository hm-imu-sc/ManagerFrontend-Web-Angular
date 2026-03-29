import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginRegistration } from './login-registration';

describe('LoginRegistration', () => {
  let component: LoginRegistration;
  let fixture: ComponentFixture<LoginRegistration>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginRegistration]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginRegistration);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
