import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UmedidaSelectComponent } from './umedida-select.component';

describe('UmedidaSelectComponent', () => {
  let component: UmedidaSelectComponent;
  let fixture: ComponentFixture<UmedidaSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UmedidaSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UmedidaSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
