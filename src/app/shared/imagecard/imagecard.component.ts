import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-imagecard',
  templateUrl: './imagecard.component.html',
  styleUrls: ['./imagecard.component.scss']
})
export class ImagecardComponent implements OnInit {

  @Input() title: string;
  @Input() desc: string;
  @Input() footerTitle: string;
  @Input() position: string;
  @Input() image: string;

  constructor() { }

  ngOnInit(): void {
  }

}
