import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriaSelectComponent } from './categoria-select.component';

describe('CategoriaSelectComponent', () => {
  let component: CategoriaSelectComponent;
  let fixture: ComponentFixture<CategoriaSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategoriaSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoriaSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
