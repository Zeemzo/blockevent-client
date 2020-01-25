import { Injectable } from '@angular/core';
import { NbToastrService, NbGlobalPhysicalPosition } from '@nebular/theme';
import * as sha256 from 'sha256';
import { IFirebaseUserObject, IFirebaseTicketObject } from '../../models/Common/common.model';
import { StorageService } from 'src/app/shared/services/Storage/storgare.service';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';

import axios from 'axios';
import { backend } from 'src/environments/environment';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  private firebaseDB: firebase.database.Database;
  private helper = new JwtHelperService();

  constructor(private toastrService: NbToastrService,
    private router: Router,
    private storageService: StorageService,
    private firebase: AngularFireDatabase) {
    this.firebaseDB = this.firebase.database;
  }

  decodeUserToken() {
    const tokenData = this.storageService.getJWT();
    if (!tokenData) {
      this.router.navigate(['/']);
      return null;
    }
    const token = tokenData['token'];
    if (token == null) {
      this.router.navigate(['/']);
      return null;
    } else {
      return this.helper.decodeToken(token);
    }
  }

  getTokenData() {
    const tokenData = this.storageService.getJWT();
    if (!tokenData) {
      this.router.navigate(['/']);
      return null;
    }
    const token = tokenData.token;
    if (token) {
      return this.helper.decodeToken(token);
    }

    // const tokenData = this.storageService.getUser();
    // if (!tokenData) {
    //   this.router.navigate(['/']);
    //   return null;
    // }
    // return tokenData;
    // const token = tokenData['token'];
    // if (token == null) {
    //   this.router.navigate(['/']);
    //   return null;
    // } else {
    //   return this.helper.decodeToken(token);
    // }
  }


  showErrorToast(message: string, title: string) {
    this.toastrService.danger(message, title, { position: NbGlobalPhysicalPosition.TOP_RIGHT });
  }


  showSuccessToast(message: string, title: string) {
    this.toastrService.success(message, title, { position: NbGlobalPhysicalPosition.TOP_RIGHT });
  }


  getFormValidationErrorList(formGroup: FormGroup, checkAll = false) {
    // return formControl.hasError(validation);

    const errorList = {};
    const formControlNames = Object.keys(formGroup.controls);

    for (const controlName of formControlNames) {
      const formControl = formGroup.get(controlName);

      // console.log(formControl.value);


      if (checkAll) {
        formControl.markAsDirty();
        formControl.markAsTouched();
        if (formControl.invalid && formControl.errors) {
          errorList[controlName] = true;
        } else {
          delete errorList[controlName];
        }
      } else {

        if (formControl.dirty && formControl.touched) {
          if (formControl.errors && formControl.invalid) {
            errorList[controlName] = true;
          } else {
            delete errorList[controlName];
          }
        } else {
          delete errorList[controlName];
        }
      }
    }

    return errorList;
  }


  encrpytUserDetails(userObject) {

    if (userObject == null) {
      return;
    }

    const jsonString = JSON.stringify(userObject);

    const reverseString = jsonString.split('').reverse().join('');

    const hashedData = this.hashDetails(reverseString);

    // Do AES encrption ,based on the email , hash

  }


  hashDetails(data) {
    return sha256(data);
  }


  async UpdateUserFromFirebase(userInfo: IFirebaseUserObject) {

    const response = await axios.post(`${backend}/api/user/getDetails`, {
      email: userInfo.email
    },
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.storageService.getJWT().token}`
        }
      }
    );
    let userObject: IFirebaseUserObject = null;
    if (response.status == 200) {
      userObject = response.data;
    }
    this.storageService.setUser(userObject);
    return userObject;
  }

  async GetTicketStatusFromFirebase(TicketID: string) {
    const response = await axios.post(`${backend}/api/ticket/getDetails`, {
      ticketID: TicketID
    },
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.storageService.getJWT().token}`
        }
      }
    );


    if (response != null) {
      const ticketObject: IFirebaseTicketObject = response.data;
      this.storageService.setTicket(ticketObject);
      return ticketObject;

    }

    return null;
  }

  async GetTokenStatusFromFirebase(Token: string) {
    const ticketRefernce = this.firebaseDB.ref(`tokens/${Token}`);
    const userSnapshot = await ticketRefernce.once('value');
    const ticketObject = userSnapshot.val();

    if (ticketObject != null) {
      if (ticketObject.status) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }

  }


  async SetTokenStatusToFirebase(Token: string) {
    try {
      const ticketRefernce = this.firebaseDB.ref(`tokens/${Token}`);

      const obj = { status: false };
      ticketRefernce.set(obj);
      return true;

    } catch (error) {
      return false;

    }

  }


  async GetTicketToDisplayByEvent(eventID: string) {

    const response = await axios.post(`${backend}/api/ticket/ticketsForEvent`, {
      eventID: eventID
    },
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.storageService.getJWT().token}`
        }
      }
    );


    if (response != null) {
      // const ticketObject: IFirebaseTicketObject[] = response.data;
      // this.storageService.setTicket(ticketObject);
      return response.data;

    } else {
      return null;
    }
  }
}
