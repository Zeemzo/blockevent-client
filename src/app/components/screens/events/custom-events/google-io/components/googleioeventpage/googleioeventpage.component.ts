import { Component, OnInit } from '@angular/core';
import { UtilService } from 'src/app/shared/services/Common/util.service';
import { RegistrationService } from 'src/app/shared/services/Providers/registration.service';
import { StorageService } from 'src/app/shared/services/Storage/storgare.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-googleioeventpage',
  templateUrl: './googleioeventpage.component.html',
  styleUrls: ['./googleioeventpage.component.scss']
})
export class GoogleioeventpageComponent implements OnInit {

  isRegistered = false;
  isSelected = false;

  isloaded = false;
  isLoading = true;

  alreadySubmitted = false;

  constructor(private utilService: UtilService,
    private registrationService:RegistrationService,
    private storageService:StorageService,
    private router:Router) {


     }

  async ngOnInit() {

    try {

    const token = await this.registrationService.GetAuthToken();
      //console.log(`This is token : `);
      //console.log(token);
      
      
    if(token == null){
      this.utilService.showErrorToast('Please login again','Authentication Error');
      this.storageService.removeUser();
      this.router.navigate(['/']);
    }

    this.storageService.setJWT(token);

    
    const tokenData = this.utilService.getTokenData();
    //console.log("TCL: GoogleioeventpageComponent -> ngOnInit -> tokenData", tokenData)


    if (tokenData['isRegistered'] != undefined) {
      this.isRegistered = tokenData.isRegistered;
      //console.log("TCL: GoogleioeventpageComponent -> ngOnInit -> this.isRegistered", this.isRegistered)
    }
    if (tokenData['isSelected'] != undefined) {
      this.isSelected = tokenData.isSelected;
      console.log("TCL: GoogleioeventpageComponent -> ngOnInit -> this.isSelected", this.isSelected)
    }

    try {

      this.alreadySubmitted = await this.registrationService.CheckUserAddressPresence(tokenData['email']);
    } catch (error) {
      this.alreadySubmitted = false;
    }

    this.isloaded = true;

    this.isLoading = false;
      
    } catch (error) {

      this.utilService.showErrorToast('Please login again','Authentication Error');
      this.storageService.removeUser();
      this.router.navigate(['/']);
    }

  }

  hideRegistrationForm() {
    this.isRegistered = true;
  }

}
