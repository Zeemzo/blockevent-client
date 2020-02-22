import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  ElementRef,
  ContentChild
} from "@angular/core";
import { NbDialogService, NbDialogRef } from "@nebular/theme";
import { UtilService } from "src/app/shared/services/Common/util.service";
import { StorageService } from "src/app/shared/services/Storage/storgare.service";
import {
  IFirebaseUserObject,
  IFirebaseTicketObject
} from "src/app/shared/models/Common/common.model";
import { TicketService } from "src/app/shared/services/Providers/ticket.service";
import { RegistrationService } from "src/app/shared/services/Providers/registration.service";
import { forEach } from "@angular/router/src/utils/collection";

import * as sha256 from "sha256";

@Component({
  selector: "app-event-list-item",
  templateUrl: "./event-list-item.component.html",
  styleUrls: ["./event-list-item.component.scss"]
})
export class EventListItemComponent implements OnInit {
  // @ContentChild('qrViewModal') qrRef: TemplateRef<any>;

  @ViewChild("qrViewModal", { read: TemplateRef }) qrRef: TemplateRef<any>;

  public myAngularxQrCode: string = null;
  // showTokenField = false;
  usedTicket = false;
  hasTicket = false;
  password: string;
  passwordModal: NbDialogRef<any>;
  qrModal: NbDialogRef<any>;
  showSpinner = false;

  eventToken: string;

  constructor(
    private dialogService: NbDialogService,
    private utilService: UtilService,
    private storageService: StorageService,
    private ticketService: TicketService,
    private registrationService: RegistrationService
  ) {
    this.myAngularxQrCode = "";
    this.hasTicket = false;

    const user: IFirebaseUserObject = this.storageService.getUser();
    if (user.events) {
      if (user.events.CBM3) {
        this.utilService.GetTicketStatusFromFirebase(user.events.CBM3.ticketID);
        this.hasTicket = true;
      } else if (user.events.CBM2) {
        // this.utilService.GetTicketStatusFromFirebase(user.events.CBM2.ticketID);
      } else if (user.events.CBM) {
        // this.utilService.GetTicketStatusFromFirebase(user.events.CBM.ticketID);
      } else if (user.events.GAINIGHT) {
        // this.utilService.GetTicketStatusFromFirebase(
        //   user.events.GAINIGHT.ticketID
        // );
      } else if (user.events.bumbastic) {
        // this.utilService.GetTicketStatusFromFirebase(
        //   user.events.bumbastic.ticketID
        // );
      }
    }
  }

  async ngOnInit() {
    const user: IFirebaseUserObject = this.storageService.getUser();
    if (user.events) {
      if (user.events.CBM3) {
        const ticket = await this.utilService.GetTicketStatusFromFirebase(
          user.events.CBM3.ticketID
        );
        if (ticket.ticketCount == -1) {
          this.usedTicket = true;
        }
        this.hasTicket = true;
      } else if (user.events.CBM2) {
        // this.utilService.GetTicketStatusFromFirebase(user.events.CBM2.ticketID);
      } else if (user.events.CBM) {
        // this.utilService.GetTicketStatusFromFirebase(user.events.CBM.ticketID);
      } else if (user.events.GAINIGHT) {
        // this.utilService.GetTicketStatusFromFirebase(
        //   user.events.GAINIGHT.ticketID
        // );
      } else if (user.events.bumbastic) {
        // this.utilService.GetTicketStatusFromFirebase(
        //   user.events.bumbastic.ticketID
        // );
      }
    }
  }

  openQRModal() {
    this.showSpinner = false;
    this.qrModal = this.dialogService.open(this.qrRef);
    this.passwordModal.close();
  }

  closeQRModal() {
    this.qrModal.close();
  }
  clearPassword() {
    this.password = undefined;
  }

  async viewTicket() {
    try {
      // // //console.log(this.password);
      const ticket: IFirebaseTicketObject = this.storageService.getTicket();
      if (ticket.status == `approved`) {
        this.usedTicket = true;
      }

      if (this.password == undefined || this.password.length <= 0) {
        this.utilService.showErrorToast(`enter your password`, `Ooops..`);
        this.showSpinner = false;
        return;
      }

      const user: IFirebaseUserObject = this.storageService.getUser();

      const secret = this.registrationService.decyrptSecret(
        user.encryptedSecret,
        sha256(this.password)
      );

      // //console.log(secret);

      if (secret == null || secret.length <= 2) {
        this.utilService.showErrorToast(`password is wrong`, `Ooops..`);
        this.clearPassword();

        this.showSpinner = false;

        return;
      }

      this.clearPassword();

      const xdr = await this.ticketService.sendTicket(secret);

      if (xdr == null) {
        this.utilService.showErrorToast(
          "Unable to get ticket",
          "Ooops something went wrong!"
        );
        this.showSpinner = false;
        return null;
      }

      // //console.log(`This si where the view QR code is there`);
      // //console.log(xdr);

      const ticketID = user.events.CBM3.ticketID;
      const qrcodeObject = {
        xdr: xdr,
        emailHash: this.registrationService.hashEmail(user.email.toLowerCase()),
        ticketID: ticketID
      };

      //console.log(qrcodeObject);
      this.myAngularxQrCode = JSON.stringify(qrcodeObject);
      this.openQRModal();
    } catch (error) {
      // //console.log(error);
      this.utilService.showErrorToast(
        "Unable to get ticket",
        "Ooops something went wrong!"
      );
      this.showSpinner = false;
    }
  }

  openPasswordModal(dialog: TemplateRef<any>) {
    if (!this.usedTicket) {
      this.passwordModal = this.dialogService.open(dialog);
    } else {
      this.dialogService.open(this.qrRef);
    }
  }

  async handleTicketing() {
    this.showSpinner = true;
    if (!this.hasTicket) {
      await this.getTicket();
    } else {
      await this.viewTicket();
    }
  }

  async getTicket() {
    try {
      // //console.log(this.password);

      // if ((this.eventToken == undefined || this.eventToken == null || this.eventToken == "")) {
      //   this.utilService.showErrorToast(`enter your token`, `Ooops..`);
      //   this.showSpinner = false;
      //   return;
      // }

      if (
        this.password == undefined ||
        this.password == null ||
        this.password == ""
      ) {
        this.utilService.showErrorToast(`enter your password`, `Ooops..`);
        this.showSpinner = false;
        return;
      }

      // const tokenStatus = await this.utilService.GetTokenStatusFromFirebase(this.eventToken);
      // //console.log(tokenStatus);
      // if (!tokenStatus) {
      //   this.utilService.showErrorToast(`token is invalid`, `Ooops..`);
      //   this.showSpinner = false;
      //   return;
      // } else {
      let user: IFirebaseUserObject = this.storageService.getUser();

      const secret = this.registrationService.decyrptSecret(
        user.encryptedSecret,
        sha256(this.password)
      );

      if (secret == null || secret.length <= 2) {
        this.utilService.showErrorToast(`password is wrong`, `Ooops..`);
        this.showSpinner = false;
        this.clearPassword();

        return;
      }

      this.clearPassword();

      /**
       *
       * This is where the thingy comes where you need to use eventToken to the firebase
       *
       */

      const ticketObject = await this.ticketService.getTicketByTrustline(
        secret,
        "CBM3",
        user.email
      );

      if (!ticketObject) {
        this.utilService.showErrorToast(
          "Unable to get ticket",
          "Failed to get ticket!!!"
        );
        return;
      }

      // await this.utilService.SetTokenStatusToFirebase(this.eventToken);
      await this.utilService.UpdateUserFromFirebase(user);
      user = this.storageService.getUser();
      await this.utilService.GetTicketStatusFromFirebase(
        user.events.CBM3.ticketID
      );

      const xdr = await this.ticketService.sendTicket(secret);

      // //console.log(`This is the xdr ${xdr}`);

      if (xdr == null) {
        this.utilService.showErrorToast("", "Unable to create ticket");
        this.showSpinner = false;

        return;
      }

      const ticketID = user.events.CBM3.ticketID;
      const qrcodeObject = {
        xdr: xdr,
        emailHash: this.registrationService.hashEmail(user.email.toLowerCase()),
        ticketID: ticketID
      };
      //console.log(qrcodeObject);

      this.myAngularxQrCode = JSON.stringify(qrcodeObject);

      this.utilService.showSuccessToast("Ticket has been reserved!", "");
      this.hasTicket = true;

      this.openQRModal();
      // }

      // //console.log(`QR Code Added`);
    } catch (error) {
      // //console.log(error);

      this.utilService.showErrorToast(
        "Ooops something went wrong",
        "Failed to get ticket!"
      );
      this.showSpinner = false;
    }
  }
}
