import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsExcelimportComponent } from './products-excelimport.component';

describe('ProductsExcelimportComponent', () => {
  let component: ProductsExcelimportComponent;
  let fixture: ComponentFixture<ProductsExcelimportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductsExcelimportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsExcelimportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
