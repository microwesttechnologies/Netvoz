import { Component, OnInit, Input} from '@angular/core';
import { AuthService } from '../../core/service/auth.service';
import { User } from '../../Data/models/user';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],

})
export class SidebarComponent implements OnInit {

  show= true;

  @Input()

  showFiller = false;
  user: User;

  nombreEmpresa: string;

  constructor(private authenticationService: AuthService) {
  this.authenticationService.user.subscribe(x => this.user = x);
  }
  ngOnInit(): void {

  }

  logout() {
    this.authenticationService.logout();
}

}
