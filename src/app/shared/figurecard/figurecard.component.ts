import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-figurecard',
  templateUrl: './figurecard.component.html',
  styleUrls: ['./figurecard.component.scss']
})
export class FigurecardComponent implements OnInit {

  @Input() headerIcon: string;
  @Input() category: string;
  @Input() title: string;
  @Input() footerIcon: string;
  @Input() footContent: string;
  @Input() linearColor: string;
  @Input() boxShadow: string;
  @Output() onClick = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }

  onClickButton(event) {
    this.onClick.emit(event);
  }


}
