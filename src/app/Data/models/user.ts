// tslint:disable: variable-name
export class User {
  email: string;
  username: string;
  password: string;
  nombre: string;
  token: string;
  refresh_token?: string;
  expires_in: number;
}

export class NewUser {
  USU_Id: string;
  USU_NivelOrg: string;
  USU_IdPadre: string;
  USU_Nombres: string;
  USU_Apellidos: string;
  USU_Email: string;
  USU_Usuario: string;
  USU_Contrasena: string;
  USU_FechaUltimaActualizacion: string;
  USU_FechaUltimoAcceso: string;
  USU_FechaNacimiento: string;
  USU_Estado: string;
  USU_Bloqueado: string;
  ROL_Id: number;
  token: string;
  refresh_token?: string;
}

export class NewBussine {
  EMP_Id: number;
  EMP_Nit: string;
  EMP_Nombre: string;
  EMP_Direccion: string;
  CEM_Id: number;
  CIU_Id: number;
  DEP_Id: number;
  EMP_Imagen: string;
  EMP_FechaUltimaActualizacion: string;
  EMP_Estado: boolean;
  EMP_EpaycoKey: string;
  EMP_PorcentajeComision: number;
  EMP_Banco: string;
  EMP_TipoCuenta: string;
  EMP_NumeroCuenta: string;
  EMP_TitularCuenta: string;
  EMP_Email: string;
  EMP_AdminArea: string;
  EMP_CodigoPais: string;
  EMP_NombrePais: string;
  EMP_Localidad: string;
  EMP_CodigoPostal: string;
  EMP_Latitud: number;
  EMP_Longitud: number;
  EMP_Color: string;
  EMP_Instagram: string;
  EMP_Facebook: string;
  EMP_Whatsapp: string;
  EMP_Estrellas: number;
  CEM_ClasificacionEmpresaCEM_Nombre: string;
  CIU_CuidadesCIU_Nombre: string;
  DEP_DepartamentosDEP_Nombre: string;
}

