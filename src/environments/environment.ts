// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebaseConfigs: {
    apiKey: "AIzaSyBs5H_CSIFUkjXXmpFmrimbv6bdArAodWM",
    authDomain: "blockevent-f2ad5.firebaseapp.com",
    databaseURL: "https://blockevent-f2ad5.firebaseio.com",
    projectId: "blockevent-f2ad5",
    storageBucket: "blockevent-f2ad5.appspot.com",
    messagingSenderId: "404696841408",
    appId: "1:404696841408:web:dd61e35a97613cbf"
  }
};


export const backend = 'https://ticketyserver.herokuapp.com';
// export const backend = 'https://1hytvbcce4.execute-api.us-east-1.amazonaws.com/dev';
// export const backend = 'http://localhost:9000';

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.

