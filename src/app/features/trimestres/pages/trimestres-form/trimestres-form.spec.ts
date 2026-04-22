import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrimestresForm } from './trimestres-form';

describe('TrimestresForm', () => {
  let component: TrimestresForm;
  let fixture: ComponentFixture<TrimestresForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrimestresForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrimestresForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
