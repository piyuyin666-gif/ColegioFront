import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrimestresList } from './trimestres-list';

describe('TrimestresList', () => {
  let component: TrimestresList;
  let fixture: ComponentFixture<TrimestresList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrimestresList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrimestresList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
