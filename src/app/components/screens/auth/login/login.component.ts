import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RegistrationService } from 'src/app/shared/services/Providers/registration.service';
import { IUserInfo } from 'src/app/shared/models/Common/common.model';
import { UtilService } from 'src/app/shared/services/Common/util.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginFormGroup: FormGroup;

  showSpinner = false;


  loginErrorList:any = {};

  constructor(private formBuilder: FormBuilder,
    private registrationService: RegistrationService,
    private utilService: UtilService,
    private router: Router) { }

  async ngOnInit() {

    try {

      this.buildLoginForm();


    } catch (error) {

      // //console.log(error);

      // //console.log(`Error Message`);

      // console.error(error.message);

    }

  }

  buildLoginForm() {
    this.loginFormGroup = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],

    });
  }

  handleCardSpinner(show: boolean) {

    this.showSpinner = show;

  }

  async handleSignIn() {

    this.handleCardSpinner(true);

    this.loginErrorList = this.utilService.getFormValidationErrorList(this.loginFormGroup, true);

    if (this.loginFormGroup.valid) {

      try {
        const formValues: IUserInfo = this.loginFormGroup.value;

        const loginStatus = await this.registrationService.signIn(formValues);

        // //console.log(loginStatus);

        if (loginStatus.success) {

          this.utilService.showSuccessToast('', 'Login Successful');
          // //console.log(`This is a test`);
          this.registrationService.logoutSubscription.next(true);
          this.router.navigate(['/events']);

          return;
        } else {
          this.utilService.showErrorToast(loginStatus.msg, 'Login Failed');
          // this.loginFormGroup.reset();
        }

        this.handleCardSpinner(false);

      } catch (error) {
        // //console.log(error);
        // alert(`Error has happened`);
        this.utilService.showErrorToast(`Unable to get you in`, `Oops something went wrong`);
        this.handleCardSpinner(false);

      }

    } else {
      this.handleCardSpinner(false);
      // this.utilService.showErrorToast(`Fill missing fie`)
      // alert(`Form is not not valid`);
    }

  }
}
