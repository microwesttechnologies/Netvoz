import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-umedida-select',
  templateUrl: './umedida-select.component.html',
  styleUrls: ['./umedida-select.component.scss']
})
export class UmedidaSelectComponent implements OnInit {
  selectUme: FormControl;
  @Input() idUme: Number;
  @Input() uMedidas: [];  
  @Output() umeSelect = new EventEmitter<number>();
  constructor() { }

  ngOnInit(): void {
    this.selectUme = new FormControl(this.idUme);
  }

}
