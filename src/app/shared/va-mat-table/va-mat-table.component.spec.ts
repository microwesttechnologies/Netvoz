import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VaMatTableComponent } from './va-mat-table.component';

describe('VaMatTableComponent', () => {
  let component: VaMatTableComponent;
  let fixture: ComponentFixture<VaMatTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VaMatTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VaMatTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
