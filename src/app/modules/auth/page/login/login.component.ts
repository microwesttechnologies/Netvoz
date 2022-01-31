import { Component, OnInit } from "@angular/core";
import { Input, Output, EventEmitter } from "@angular/core";
import { MatProgressButtonOptions } from "mat-progress-buttons";
import { Router, ActivatedRoute } from "@angular/router";
import {
  FormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { first } from "rxjs/operators";
import { AuthService } from "../../../../core/service/auth.service";
import { User } from "../../../../Data/models/user";
import { AlertService } from "../../../../core/service/alert.service";
import AOS from 'aos';

declare const swal: any;

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  usuario: User;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private alertService: AlertService
  ) {
    this.createForm();
  }

  createForm() {
    this.form = this.formBuilder.group({
      username: ["", Validators.required],
      password: ["", Validators.required],
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/";
  }

  ngOnInit(): void { AOS.init(); }

  openAlert() {
    swal({
      title: "Good job!",
      text: "It's pretty, isn't it?",
      confirmButtonClass: "btn btn-info",
    });
  }

  get f() {
    return this.form.controls;
  }

  onSubmit() {
    this.submitted = true;

    // reset alerts on submit
    //this.alertService.clear();

    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    this.usuario = new User();
    this.usuario.username = this.f.username.value;
    this.usuario.password = this.f.password.value;

    this.authService
      .login(this.usuario)
      .pipe(first())
      .subscribe(
        (data) => {
          this.authService.getUser().subscribe((userinfo) => {

            this.authService.saveInfoUser(userinfo);

            const empresa = userinfo?.USU_EmpresasUsuarios;
            // console.log("datos que debe imprimir"+empresa[0]);
            if (empresa[0] != null) {
              this.router.navigate(["home/dashboard"]);
            } else {
              this.alertService.opensweetalert(
                "error",
                "Autenticación",
                "No tiene autorizacion para entrar a esta aplicación"
              );
              this.loading = false;
            }
          });
        },
        (error) => {
          /*  console.log(Responseerror); */

          //this.alertService.opensweetalert('error','Autenticación',error);
          this.loading = false;
        }
      );
  }

  @Input() error: string | null;
  @Output() submitEM = new EventEmitter();
}
