import { Injectable } from "@angular/core";
import {Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import { AuthService } from "../service/auth.service";

@Injectable({ providedIn: "root" })
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private accountService: AuthService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const user = this.accountService.login;
    if (user) {
      const data = JSON.parse(localStorage.getItem("userinfo"));
      this.accountService.getInfoUser(data);
      // authorised so return true
      return true;
    }

    // not logged in so redirect to login page with the return url
    this.router.navigate(["/auth/login"], {
      queryParams: { returnUrl: state.url },
    });
    return false;
  }
}
