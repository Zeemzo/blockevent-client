import { AES, enc } from 'crypto-js';
import * as sha256 from 'sha256';
import { Network, Server, Keypair, Asset, TransactionBuilder, Operation } from 'stellar-sdk';
import * as http from 'http';
import axios from 'axios';
import { backend } from 'src/environments/environment';
import { StorageService } from 'src/app/shared/services/Storage/storgare.service';
import { Subscription, Subject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { IFunctionResponse, IFirebaseUserObject, IUserInfo } from '../../models/Common/common.model';
import { resolve } from 'url';
import { JwtHelperService } from '@auth0/angular-jwt';
const helper = new JwtHelperService();

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  private STELLAT_FRIEND_BOT_URL = `https://friendbot.stellar.org/?addr=`;

  private firebaseDB: firebase.database.Database;

  private userSubject = new Subject<any>();

  logoutSubscription: Subject<any>;

  constructor(private firebase: AngularFireDatabase, private storageService: StorageService) {
    this.firebaseDB = this.firebase.database;

    this.logoutSubscription = new Subject();
  }

  setUser(user: IFirebaseUserObject) {
    this.userSubject.next({ text: user });
  }

  clearUser() {
    this.userSubject.next();
  }

  getUser(): Observable<any> {
    return this.userSubject.asObservable();
  }


  encyrptSecret(secret, signer) {
    try {
      const ciphertext = AES.encrypt(secret, signer);

      // //console.log('secret => ' + secret);
      // //console.log('signer => ' + signer);
      // //console.log('ciphertext => ' + ciphertext);
      return ciphertext.toString();
    } catch (error) {
      // //console.log(error);
      return null;
    }
  }

  decyrptSecret(secret, signer) {
    try {
      const decrypted = AES.decrypt(secret, signer);
      const plaintext = decrypted.toString(enc.Utf8);

      // //console.log('secret => ' + secret);
      // //console.log('decrypted => ' + plaintext);
      return plaintext;
    } catch (error) {
      // //console.log(error);

      return null;
    }
  }

  async createAddress() {
    try {
      const pair = Keypair.random();

      let secret = pair.secret();

      let publicKey = pair.publicKey();
      // //console.log(secret);
      // //console.log(publicKey);

      const stellarResponse = await axios.get(`${this.STELLAT_FRIEND_BOT_URL}${publicKey}`);

      // //console.log(stellarResponse);

      if (stellarResponse.status == 200) {
        return { secret, publicKey };
      } else {
        // return null;

        secret = 'SCQVG3XZF5YIKL767KE7NP2QTHFSPAEV437375TB3GX5BXCDVNIU33DH';
        publicKey = 'GBCOYU3BSZ6CD77B3NGJGOQCGC7N5YYCSENORU5NM2FEYGAKHZUZK4OY';
        return { secret, publicKey };


      }
    } catch (error) {
      // //console.log(error);
      // return null;
      const secret = 'SCQVG3XZF5YIKL767KE7NP2QTHFSPAEV437375TB3GX5BXCDVNIU33DH';
      const publicKey = 'GBCOYU3BSZ6CD77B3NGJGOQCGC7N5YYCSENORU5NM2FEYGAKHZUZK4OY';
      return { secret, publicKey };
    }
  }

  async createUserInDynamo(userObject: IFirebaseUserObject) {
    const response: IFunctionResponse = {
      success: false,
      msg: '',
      data: null
    };

    try {
      const bResponse = await axios.post(`${backend}/api/user/add`, userObject);

      // console.log(bResponse);

      if (bResponse) {
        if (bResponse.status == 200) {
          response.success = true;
          response.msg = `User has been created`;
          response.data = bResponse;
        } else if (bResponse.status == 201) {
          response.success = false;
          response.msg = `Email already exists`;
          response.data = null;
        } else if (bResponse.status == 206) {
          response.success = false;
          response.msg = `Invalid Token`;
          response.data = null;
        }
      }

      return response;
    } catch (error) {
      response.success = false;
      response.msg = error.message;

      return response;
    }
  }

  async updateUserInDynamo(userObject: IFirebaseUserObject) {
    const response: IFunctionResponse = {
      success: false,
      msg: '',
      data: null
    };

    try {
      const bResponse = await axios.post(`${backend}/api/user/update`, userObject);

      // console.log(bResponse);

      if (bResponse) {
        if (bResponse.status == 200) {
          response.success = true;
          response.msg = `User has been created`;
          response.data = bResponse;
        } else if (bResponse.status == 201) {
          response.success = false;
          response.msg = `Email already exists`;
          response.data = null;
        } else if (bResponse.status == 206) {
          response.success = false;
          response.msg = `Invalid Token`;
          response.data = null;
        }
      }

      return response;
    } catch (error) {
      response.success = false;
      response.msg = error.message;

      return response;
    }
  }
  async signUp(authenticationDetails: IUserInfo, otpCode: string, ideamartServerRef: string) {
    try {
      const pair = await this.createAddress();

      // //console.log(`Pair`);

      // //console.log(pair);
      const { username, email, password, phoneNumber } = authenticationDetails;
      let encSecret;
      let publicK;
      if (pair == null) {
        // this error has been omitted in case the blockchain friendbot fails
        // return this.createResponse(false, `Error in creating Key Pair`, null);
        encSecret = '';
        publicK = '';
      } else {
        encSecret = this.encyrptSecret(pair.secret, sha256(password));
        publicK = pair.publicKey;
      }

      let userObject: IFirebaseUserObject = {
        username: username,
        email: email,
        publicKey: publicK,
        encryptedSecret: encSecret,
        pash: sha256(password),
        access: 'user',
        phoneNumber: phoneNumber,
        isRegistered: false,
        pin: otpCode,
        serverRef: ideamartServerRef
      };

      // console.log(userObject);

      const jwt = await this.createUserInDynamo(userObject);
      // console.log(`Dynamo Data`);


      if (jwt == null) {
        return this.createResponse(false, `Registration Failed`, null);
      } else {
        if (jwt) {

          userObject = helper.decodeToken(jwt.data.data.token);
          this.storageService.setJWT(jwt.data.data);
          this.setUser(userObject);
          this.storageService.setUser(userObject);
          return this.createResponse(true, `Registration Success`, null);

        }
      }

      return this.createResponse(true, `Registration Succes!`, jwt);

    } catch (error) {
      // console.log(error);
      return this.createResponse(false, `Ooops something went wrong, please try again!`, null);
    }
  }

  async signUpdate(authenticationDetails: IUserInfo, otpCode: string, ideamartServerRef: string) {
    try {
      const pair = await this.createAddress();

      // //console.log(`Pair`);

      // //console.log(pair);
      const { username, email, password, phoneNumber } = authenticationDetails;
      let encSecret;
      let publicK;
      if (pair == null) {
        // this error has been omitted in case the blockchain friendbot fails
        // return this.createResponse(false, `Error in creating Key Pair`, null);
        encSecret = '';
        publicK = '';
      } else {
        encSecret = this.encyrptSecret(pair.secret, sha256(password));
        publicK = pair.publicKey;
      }

      let userObject: IFirebaseUserObject = {
        username: username,
        email: email,
        publicKey: publicK,
        encryptedSecret: encSecret,
        pash: sha256(password),
        access: 'user',
        phoneNumber: phoneNumber,
        isRegistered: false,
        pin: otpCode,
        serverRef: ideamartServerRef
      };

      // console.log(userObject);

      const jwt = await this.updateUserInDynamo(userObject);
      // console.log(`Dynamo Data`);


      if (jwt == null) {
        return this.createResponse(false, `Update Failed`, null);
      } else {
        if (jwt) {

          userObject = helper.decodeToken(jwt.data.data.token);
          this.storageService.setJWT(jwt.data.data);
          this.setUser(userObject);

          this.storageService.setUser(userObject);
          return this.createResponse(true, `Update Success`, null);

        }
      }

      return this.createResponse(true, `Registration Succes!`, jwt);

    } catch (error) {
      // console.log(error);
      return this.createResponse(false, `Ooops something went wrong, please try again!`, null);
    }
  }
  async SendToken(telephone: string): Promise<any> {
    // tslint:disable-next-line:no-shadowed-variable
    return new Promise((resolve, reject) => {
      // axios.post('http://localhost:7000/api/sendToken',
      axios
        .post(
          `${backend}/api/sendToken`,
          {
            telephone: telephone
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          }
        )
        .then(res => {
          // console.log(res);
          resolve(res);
        })
        .catch(err => {
          // //console.log(err);
          reject(null);
        });
    });
  }

  // async VerifyToken(pin: string, serverRef: string) {
  //   // tslint:disable-next-line:no-shadowed-variable
  //   return new Promise((resolve, reject) => {
  //     // axios.post('http://localhost:7000/api/verifyToken',
  //     axios
  //       .post(
  //         `${backend}/api/verifyToken`,
  //         {
  //           pin: pin,
  //           serverRef: serverRef
  //         },
  //         {
  //           headers: {
  //             'Content-Type': 'application/json',
  //             'Accept': 'application/json'
  //           }
  //         }
  //       )
  //       .then(res => {
  //         //console.log(res);
  //         resolve(res);
  //       })
  //       .catch(err => {
  //         reject(null);
  //       });
  //   });
  // }

  async GetGitUserDetails(gitID: string) {
    // tslint:disable-next-line:no-shadowed-variable
    return new Promise((resolve, reject) => {
      // axios.post('http://localhost:7000/api/verifyToken',
      axios
        .get(`${backend}/api/getGitUserDetails/${gitID}`, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        })
        .then(res => {
          // console.log(res.data);
          resolve(res.data);
        })
        .catch(err => {
          reject(null);
        });
    });
  }

  async GetAuthToken() {
    // tslint:disable-next-line:no-shadowed-variable
    return new Promise((resolve, reject) => {
      // axios.post('http://localhost:7000/api/verifyToken',
      axios
        .post(
          `${backend}/api/token`, null,
          {
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Authorization': `Bearer ${this.storageService.getJWT().token}`
            }
          }
        )
        .then(res => {
          // console.log(res.data);
          resolve(res.data);
        })
        .catch(err => {
          reject(null);
        });
    });
  }

  async GetStackUserDetails(stackID: string) {
    // tslint:disable-next-line:no-shadowed-variable
    return new Promise((resolve, reject) => {
      // axios.post('http://localhost:7000/api/verifyToken',
      axios
        .get(`${backend}/api/getStackUserDetails/${stackID}`, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        })
        .then(res => {
          // console.log(res.data);
          resolve(res.data);
        })
        .catch(err => {
          reject(null);
        });
    });
  }

  createResponse(success: boolean, msg: string, data: any) {
    const response: IFunctionResponse = {
      success,
      msg,
      data
    };

    return response;
  }

  async signIn(userInfo: IUserInfo) {
    try {
      let userObject: IFirebaseUserObject = null;
      const response = await axios.post(`${backend}/api/user/login`,
        { email: userInfo.email, password: sha256(userInfo.password) });
      let jwt = null;
      // console.log(userObject);
      if (response) {
        if (response.status == 201) {
          jwt = response.data;
        } else if (response.status == 202) {
          return this.createResponse(false, `Account not found`, null);
        } else if (response.status == 203) {
          return this.createResponse(false, `Password is Incorrect`, null);
        }

      }
      // console.log(userObject);

      if (jwt == null) {
        return this.createResponse(false, `Account not found`, null);
      } else {
        if (jwt) {
          this.storageService.setJWT(jwt);
          userObject = helper.decodeToken(jwt.token);
          this.setUser(userObject);

          this.storageService.setUser(userObject);
          return this.createResponse(true, `Login Success`, null);

        }
      }
    } catch (error) {
      // //console.log(error);
      // //console.log(`Error has been thrown`);

      return this.createResponse(false, error.message, null);
    }
  }

  async SendRegForm(obj: object): Promise<any> {
    // tslint:disable-next-line:no-shadowed-variable
    return new Promise((resolve, reject) => {
      // axios.post('http://localhost:7000/api/sendToken',
      axios
        .post(`${backend}/api/regForm/submit`, obj, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${this.storageService.getJWT().token}`
          }
        })
        .then(res => {
          // console.log(res);
          resolve(res);
        })
        .catch(err => {
          // console.log(err);
          reject(null);
        });
    });
  }

  async CheckEmailAvailability(email: string) {
    const response = await axios.post(`${backend}/api/user/checkAvailability`, { email: email });
    if (response) {
      return response.data.available;
    }
  }

  async GetMobileForEmail(email: string) {
    const response = await axios.post(`${backend}/api/user/mobileForEmail`, { email: email });
    if (response) {
      return response.data;
    } else {
      return null;
    }
  }

  async CheckMobileNumberAvailability(mobileNumber: string) {
    try {
      const response = await axios.post(`${backend}/api/user/checkMobileNumberAvailability`, { phoneNumber: mobileNumber });
      if (response) {
        return response.data.available;
      } else {
        return false;
      }
    } catch (error) {
      //console.log(error);
      return false;
    }
  }

  async CheckUserAddressPresence(email: string) {
    try {
      const response = await axios.post(`${backend}/api/user/checkUserAddressPresence`, { email: email });
      if (response) {
        return response.data.present;
      } else {
        return false;
      }
    } catch (error) {
      // console.log(error);
      return false;
    }
  }

  async AddAddress(email: string, address: string) {
    try {
      const response = await axios.post(`${backend}/api/user/updateAddress`,
        {
          email: email,
          address: address
        }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${this.storageService.getJWT().token}`
        }
      });
      if (response) {
        //console.log(response);

        if (response.status == 200) {
          return true;
        }
        return false;
      }
    } catch (e) {
      //console.log(e);

      return false;
    }

  }
  hashEmail(email) {
    return sha256(email);
  }
}
