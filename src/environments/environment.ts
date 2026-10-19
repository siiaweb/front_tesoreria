// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  rutaPublica: 'http://172.20.11.123:8090/api',
  rutaPortal: 'http://172.20.11.123:4500/',

  //rutaAPI: 'http://192.168.1.190:8090/api'
  //rutaAPI: 'http://192.168.10.38:8090/api'
  //rutaAPI: 'https://tesoreria.ujed.mx/api'
  rutaAPI: 'http://172.20.11.123:8090/portal',
  //rutaAlumno:'http://localhost:8085/SIIAWEB'
  rutaAlumno:'https://sistemas.ujed.mx/SIIA'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
