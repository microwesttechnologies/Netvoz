// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: true,
  apiUrl: 'https://netvozapi.azurewebsites.net/api/v1/',
  sasP: 'sp=racwdli&st=2022-02-10T16:34:10Z&se=2023-02-11T00:34:10Z&sv=2020-08-04&sr=c&sig=1jBMAyHtWmDd1BWBrlKHQySRbB9dY46Vqgt9l4qKCYA%3D',
  sasE: 'sp=racwdli&st=2021-11-20T18:05:35Z&se=2022-11-21T02:05:35Z&sv=2020-08-04&sr=c&sig=GIKDdWhSArd8xu%2FlBOiXA9MXRhrqdEsn78acpE9A0Yw%3D'
};

// sasP - Cambiar código sas el día 10 de febrero del 2023
// sasE - Cambiar código sas el día 20 de noviembre del 2022
// Puedes acceder con la ruta de abajo y las credenciales de Azure
// https://portal.azure.com/#blade/Microsoft_Azure_Storage/ContainerMenuBlade/sas/storageAccountId/%2Fsubscriptions%2Fbe830cbc-c74d-4aea-8cb7-ae94373ac000%2FresourceGroups%2FGrupo-Netvoz%2Fproviders%2FMicrosoft.Storage%2FstorageAccounts%2Fnetvoz/path/productos/etag/%220x8D95B5398065E8C%22/defaultEncryptionScope/%24account-encryption-key/denyEncryptionScopeOverride//defaultId//publicAccessVal/Container


/*
 * For ng build --prodeasier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
