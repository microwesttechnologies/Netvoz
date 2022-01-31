import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/service/auth.service';
import { User } from '../../Data/models/user';
import { OrdenService } from '../../core/service/orden.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  user: User;
  nombreEmpresa: string

  constructor(
    public authenticationService: AuthService,
    private router:Router,
    public ordenService:OrdenService) {
    this.authenticationService.user.subscribe(x => this.user = x);
   }

  ngOnInit(): void {
    const data =  JSON.parse(localStorage.getItem('userinfo'));
    if (data && data.USU_EmpresasUsuarios){
      this.nombreEmpresa = data.USU_EmpresasUsuarios[0].Nombre;
    }
  }

  logout() {
    this.authenticationService.logout();
  }

  @Input()
  value: string;

}
