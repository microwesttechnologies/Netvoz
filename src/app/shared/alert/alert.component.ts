import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
//import { AlertService } from '../../core/service/alert.service';


@Component({
  selector: 'alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit {
  private subscription: Subscription;
  message: any;
  constructor() { }

  ngOnInit(): void {
   /*  this.subscription = this.alertService.getMessage().subscribe(message => { 
      this.message = message;  
  });*/
  }

/*   ngOnDestroy() {
    this.subscription.unsubscribe(); 
}*/

}
