import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-categoria-select',
  templateUrl: './categoria-select.component.html',
  styleUrls: ['./categoria-select.component.scss']
})
export class CategoriaSelectComponent implements OnInit {
  selectCategoria: FormControl;
  @Input() idCate: Number;
  @Input() categorias: [];  
  @Output() catSelect = new EventEmitter<number>();
  
  constructor() { }

  ngOnInit(): void {
    this.selectCategoria = new FormControl(this.idCate);
  }

  onSelectCategoria(value) {
  }

}
