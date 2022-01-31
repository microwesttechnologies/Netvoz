import { Component, OnInit } from "@angular/core";
import {FormGroup, FormControl, Validators, FormBuilder} from "@angular/forms";
import { NewUser, User } from "src/app/Data/models/user";
import { ResponsiveI } from "src/app/Data/models/responsive";
import { AuthService } from "src/app/core/service/auth.service";
import { AlertService } from "src/app/core/service/alert.service";
import { Router, ActivatedRoute } from "@angular/router";
import { state } from "@angular/animations";
import AOS from 'aos';

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"],
})
export class RegisterComponent implements OnInit {
  newForm: FormGroup;
  codeForm: FormGroup;
  statusForm = true;
  show = false;
  codigo: number;
  validateEmail = false;
  codigoFail = true;

  constructor(
    private api: AuthService,
    public alertService: AlertService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    const min = Math.ceil(1000);
    const max = Math.floor(9999);

    this.codigo = Math.floor(Math.random() * (max - min) + min);

    this.newForm = this.formBuilder.group({
      $id: ["1"],
      ROL_RolesROL_Nombre: [""],
      USU_NombreCompleto: [""],
      USU_EmpresasUsuarios: [[]],
      getUsuariosDetalle: [null],
      getUsuariosCuentas: [[]],
      getDireccionesUsuario: [[]],
      DUS_DireccionUsuario: this.formBuilder.group({
        $id: ["2"],
        DUS_Id: [0],
        USU_Id: [0],
        DUS_Direccion: [""],
        DUS_AdminArea: [null],
        DUS_CodigoPais: [null],
        DUS_NombrePais: [null],
        DUS_NombreCaracteristica: [null],
        DUS_Localidad: [null],
        DUS_CodigoPostal: [null],
        DUS_SubAdminArea: [null],
        DUS_SubLocalidad: [null],
        DUS_NombreCalle: [null],
        DUS_SubNombreCalle: [null],
        DUS_Latitud: [0.0],
        DUS_Longitud: [0.0],
        DUS_Estado: [false],
        DUS_FechaUltimaActualizacion: ["0001-01-01T00:00:00"],
        DUS_Principal: [false],
      }),
      UDE_UsuarioDetalle: this.formBuilder.group({
        $id: ["3"],
        USU_UsuariosUSU_Nombres: [""],
        TDO_TipoDocumentosTDO_Nombre: [""],
        GEN_GeneroGEN_Nombre: [""],
        UDE_Id: [0],
        USU_Id: [0],
        TDO_Id: [null],
        USU_NumeroIdentificacion: [
          "",
          [Validators.required, Validators.min(5)],
        ],
        USU_Celular: ["", [Validators.required, Validators.min(10)]],
        USU_RutaImagen: [""],
        GEN_Id: [null],
        USU_Profesion: [""],
        USU_DescripcionPersonal: [""],
        USU_AceptaCondiciones: ["", [Validators.required]],
        USU_AceptaTratamientoDatos: [false],
        USU_AceptaNoticiasOfertas: ["", [Validators.required]],
        USU_ActivarNotificaciones: [null],
      }),
      UCU_UsuarioCuenta: this.formBuilder.group({
        $id: ["4"],
        USU_UsuariosUSU_Nombres: [""],
        TIS_TipoInicioSesionTIS_Nombre: [""],
        UCU_Id: [0],
        USU_Id: [0],
        TIS_Id: [3],
        UCU_Codigo: [null],
        UCU_Email: [null],
        UCU_Estado: [false],
      }),
      USU_Id: [0],
      USU_NivelOrg: [null],
      USU_IdPadre: [null],
      USU_Nombres: ["", [Validators.required, Validators.max(20)]],
      USU_Apellidos: ["", [Validators.required, Validators.max(20)]],
      USU_Email: ["", [Validators.required, Validators.email]],
      USU_Usuario: [""],
      USU_Contrasena: [
        "",
        [Validators.required, Validators.min(8), Validators.max(16)],
      ],
      USU_Contrasena_Confirm: [
        "",
        [Validators.required, Validators.min(8), Validators.max(16)],
      ],
      USU_FechaUltimaActualizacion: ["2021-06-23T15:05:29.990243+00:00"],
      USU_FechaUltimoAcceso: ["2021-06-23T15:05:29.99027+00:00"],
      USU_FechaNacimiento: ["1980-06-23T00:00:00"],
      USU_Estado: [true],
      USU_Bloqueado: [false],
      ROL_Id: [null],
    });
    AOS.init();
  }

  valSector = (campo: string) => {
    if (
      !this.statusForm ||
      (this.newForm.get(`${campo}`).invalid &&
        this.newForm.get(`${campo}`).touched)
    ) {
      if (this.newForm.get(`${campo}`).valid) {
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  };

  validatePassword = () => {
    const clave = this.newForm.get("USU_Contrasena").value;
    const clavec = this.newForm.get("USU_Contrasena_Confirm").value;
    if (clave !== clavec) {
      return true;
    } else {
      return false;
    }
  };

  sendCodeEmail = () => {
    if (this.newForm.valid && !this.validatePassword()) {
      this.statusForm = true;
      const nombre = this.newForm.get("USU_Nombres").value;
      const apellidos = this.newForm.get("USU_Apellidos").value;
      const usuario = this.newForm.get("USU_Email").value;
      const identificacion = this.newForm.get("UDE_UsuarioDetalle.USU_NumeroIdentificacion").value;
      const telefono = this.newForm.get("UDE_UsuarioDetalle.USU_Celular").value;

      const params = {
        codigo: this.codigo,
        nombreUsuario: nombre,
        apellidoUsuario: apellidos,
        emailUsuario: usuario,
      };

      const paramsR = {
        nombreUsuario: nombre,
        apellidoUsuario: apellidos,
        identificacion: identificacion,
        emailUsuario: usuario,
        telefon: telefono,
      };

      this.api
        .validateEmail({ $id: 1, USU_Email: usuario })
        .subscribe((data) => {
          if (!data) {
            this.api.sendEmail(params).subscribe((data) => (this.show = data));
            this.api.sendEmailRegister(paramsR).subscribe((data) => (this.show = data));
          } else {
            this.validateEmail = true;
          }
        });
    } else {
      this.statusForm = false;
    }
  };


  postForm(codigo) {
    if (this.codigo === +codigo) {
      const nombre = this.newForm.get("USU_Nombres").value;
      const apellidos = this.newForm.get("USU_Apellidos").value;
      const usuario = this.newForm.get("USU_Email").value;

      this.newForm.get("USU_NombreCompleto").setValue(`${nombre} ${apellidos}`);
      this.newForm.get("USU_Usuario").setValue(`${usuario}`);

      const dataUser = this.newForm.value;
      delete dataUser.USU_Contrasena_Confirm;

      this.api.postUser(dataUser).subscribe((data) => {
        if (data) {
          console.log("Entra");
        }
      });
      this.alertService.opensweetalert(
        "success",
        "Codigo verificado",
        "En un momento uno de nuestros asesores se pondra en contacto contigo para activar tu cuenta"
      );
    } else {
      console.log("Error", this.codigo, codigo, +codigo);
      this.alertService.opensweetalert(
        "error",
        "Codigo invalido",
        "Verifica tu codigo e ingresalo nuevamente"
      );
    }
  }
}
