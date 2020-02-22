
import { Component, Inject, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { RegistrationService } from 'src/app/shared/services/Providers/registration.service';
import { StorageService } from 'src/app/shared/services/Storage/storgare.service';
import { IFirebaseUserObject } from 'src/app/shared/models/Common/common.model';
import { NB_WINDOW, NbMenuService } from '@nebular/theme';
import { filter, map } from 'rxjs/operators';
import { UtilService } from 'src/app/shared/services/Common/util.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.css']
})
export class BodyComponent implements OnInit {

  showSignOut = false;

  userDetails: IFirebaseUserObject = null;
  subscription: Subscription;

  items;
  // items = this.storageService.getUser() != null ?
  //   [{ title: this.storageService.getUser().publicKey.substring(0, 8) + '......', data: 'publicKey' },
  //   { title: 'Log out', data: 'logout' }]
  //   : [{ title: 'Log out', data: 'logout' }];
  isHome = false;

  constructor(private router: Router,
    private registrationService: RegistrationService,
    private storageService: StorageService,
    private nbMenuService: NbMenuService,
    private utilService: UtilService,
    @Inject(NB_WINDOW) private window) {

    // Constructor


    router.events.pipe(
      filter((event: any) => event instanceof NavigationEnd)
    )
      .subscribe(event => {
        // //console.log(event);

        if (event.url == '/') {
          // //console.log(`This is home`);

          this.isHome = true;
        } else {
          this.isHome = false;
          // //console.log(`This is not home`);

        }
      });

    // const userData = this.storageService.getUser() != null ? this.storageService.getUser() : null;

    if (this.storageService.getUser()) {

      const user = this.storageService.getUser();

      if (user.iat < ((Math.floor(new Date().getTime() / 1000.0)) - 86400)) {

        this.userDetails = null;
        this.showSignOut = false;
        // this.utilService.showErrorToast('', 'User Session Timed Out');
        this.logoutUser();


      } else {
        // this.userDetails = this.storageService.getUser();
        this.registrationService.setUser(this.storageService.getUser());
        // console.log(this.storageService.getUser());
        this.userDetails = this.storageService.getUser();
        this.showSignOut = true;
        this.items =
          [{ title: this.userDetails.publicKey.substring(0, 8) + '......', data: 'publicKey' }
            , { title: 'Events', data: 'events' }, { title: 'Log out', data: 'logout' }];
      }


    }

    this.registrationService.getUser().subscribe(message => {
      // console.log(message);
      if (message) {
        this.userDetails = message.text;
        this.showSignOut = true;
        this.items =
          [{ title: this.userDetails.publicKey.substring(0, 8) + '......', data: 'publicKey' }
            , { title: 'Events', data: 'events' }, { title: 'Log out', data: 'logout' }];
      } else {
        // clear messages when empty message received
        this.userDetails = null;
        this.showSignOut = false;

      }
    });

    // if (userData == null) {
    //   this.showSignOut = false;

    // } else {
    //   this.showSignOut = true;
    //   this.items =
    //     [{ title: userData.publicKey.substring(0, 8) + '......', data: 'publicKey' }
    //       , { title: 'Events', data: 'events' }, { title: 'Log out', data: 'logout' }];
    //   this.userDetails = userData;
    // }


    // this.registrationService.logoutSubscription.subscribe((data) => {

    //   if (data) {
    //     this.showSignOut = true;
    //     this.userDetails = this.storageService.getUser();
    //     this.items =
    //       [{ title: userData.publicKey.substring(0, 8) + '......', data: 'publicKey' }
    //         , { title: 'Events', data: 'events' }, { title: 'Log out', data: 'logout' }];
    //   } else {
    //     this.showSignOut = false;
    //     this.userDetails = null;

    //   }

    // });

    // const user: IFirebaseUserObject = this.storageService.getUser();

    // if (user) {
    //   this.showSignOut = true;
    //   this.userDetails = userData;
    //   this.items =
    //     [{ title: userData.publicKey.substring(0, 8) + '......', data: 'publicKey' }, { title: 'Log out', data: 'logout' }]
    //   this.userDetails = userData;
    // } else {
    //   this.showSignOut = false;

    // }
  }


  ngOnInit() {

    this.nbMenuService.onItemClick()
      .pipe(
        filter(({ tag }) => tag == 'user-menu')
      ).subscribe(({ item }) => {
        // //console.log(item);

        if (item.data == 'logout') {

          this.logoutUser();

        } else if (item.data == 'publicKey') {
          if (this.userDetails != null) {
            this.copyMessage(this.userDetails.publicKey);
            this.utilService.showSuccessToast('', 'Public Key Copied to Clipboard');
          }
        } else if (item.data == 'events') {

          this.router.navigate(['/events'])
        }

      });



  }

  copyMessage(val: string) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

  logoutUser() {
    this.registrationService.logoutSubscription.next(false);
    this.registrationService.clearUser();
    this.storageService.removeUser();
    this.goToSignIn();

  }

  goToSignIn() {
    this.router.navigate(['./login']);

  }
  goToScanner() {
    this.router.navigate(['./scanTicket']);

  }
  goToEvent() {
    this.router.navigate(['./events']);

  }
  goToRegister() {
    this.router.navigate(['./register']);

  }
}
