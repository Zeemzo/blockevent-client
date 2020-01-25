import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { RegistrationService } from 'src/app/shared/services/Providers/registration.service';
import { IUserInfo } from 'src/app/shared/models/Common/common.model';
import { UtilService } from 'src/app/shared/services/Common/util.service';
import { Router } from '@angular/router';
import { debounceTime } from 'rxjs/operators';
import { WindowService } from './window.service';
import * as firebase from 'firebase';

// var Regex = require("regex");

const setup = require('hsimp-purescript');
const characterSets = require('hsimp-purescript/dictionaries/character-sets.json');
const periods = require('hsimp-purescript/dictionaries/periods.json');
const namednumbers = require('hsimp-purescript/dictionaries/named-numbers.json');
const top10k = require('hsimp-purescript/dictionaries/top10k.json');
const patterns = require('hsimp-purescript/dictionaries/patterns.json');
const checks = require('hsimp-purescript/dictionaries/checks.json');



@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  registraionFormGroup: FormGroup;

  windowRef: any;
  humanResult = false;

  mobileNumberTaken = false;
  emailTaken = false;
  showSpinner = false;
  PasswordStrength: null;
  StrengthPassword = '';
  ConfirmPassword = '';
  PasswordMatched = true;
  ShowPassword = false;
  showRecaptchaError = false;

  phoneFieldHasMessage = false;
  showPinField = false;

  phoneFieldMessage = '';
  phoneFieldMessageTextStatus = 'muted';

  ideamartServerRef = '';
  disabledSignUp = true;

  registerErrorList: any = {};

  showSignUpBtn = false;

  // tslint:disable-next-line:max-line-length
  constructor(private formBuilder: FormBuilder,
    private registrationService: RegistrationService,
    private utilService: UtilService,
    private router: Router, private win: WindowService) {



  }

  checkStrength() {
    const hsimp = setup({
      calculation: {
        calcs: 40e9,
        characterSets: characterSets
      },
      time: {
        periods: periods,
        namedNumbers: namednumbers,
        forever: 'Forever',
        instantly: 'an Instant'
      },
      checks: {
        dictionary: top10k,
        patterns: patterns,
        messages: checks
      }
    });

    this.PasswordStrength = hsimp(this.StrengthPassword).time;
  }
  showPassword() {
    this.ShowPassword = !this.ShowPassword;
  }

  async ngOnInit() {
    try {

      this.windowRef = this.win.windowRef;
      this.windowRef.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
        'size': 'normal',
        'callback': async (response) => {
          const token = await response;
          if (token) {
            //console.log(token);
            this.humanResult = true;
            this.showRecaptchaError = false;
          }
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          // ...
        },
        'expired-callback': function () {
          // Response expired. Ask user to solve reCAPTCHA again.
          // ...
        }
      });
      // = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
      //   'size': 'normal',
      //   'callback': function (response) {
      //     this.humanResult = true;
      //     this.showRecaptchaError = false;
      //     console.log(response);
      //     // reCAPTCHA solved, allow signInWithPhoneNumber.
      //     // ...
      //   },'expired-callback': function() {
      //     this.humanResult = true;
      //     this.showRecaptchaError = false;
      //     console.log(this.humanResult);
      //     // Response expired. Ask user to solve reCAPTCHA again.
      //     // ...
      //   }
      // });

      this.windowRef.recaptchaVerifier.render();

      this.buildRegisrationForm();
    } catch (error) {
      // //console.log(error);

      // //console.log(`Error Message`);

      console.error(error.message);
    }
  }

  async checkEmailAvaialbility() {
    // console.log(`This has been called`);
    this.emailTaken = false;

    const formValues: IUserInfo = this.registraionFormGroup.value;
    const regex = new RegExp('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$');

    if (regex.test(formValues['email'])) {
      const available = await this.registrationService.CheckEmailAvailability(formValues['email']);
      // console.log(available);
      this.emailTaken = !available;
    }
  }

  buildRegisrationForm() {
    this.registraionFormGroup = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      // phoneNumber: ['', Validators.required],
      // recaptcha: [false, Validators.required],
      terms: [false, Validators.required]
    });


    this.terms.valueChanges.pipe(debounceTime(500)).subscribe(isSelected => {

      if (isSelected && this.disabledSignUp) {

        this.showSignUpBtn = true;

      }

    });

    // this.phoneNumber.valueChanges.pipe(debounceTime(500)).subscribe(async number => {
    //   const regex = new RegExp('^7|0|(?:\\94)[0-9]{9,10}$');

    //   if (number[0] == '0') {
    //     this.phoneNumber.setValue(number.substring(1, number.length));
    //     return;
    //   }
    //   const phoneNumber = `94${number}`;
    //   this.ideamartServerRef = false;
    //   this.mobileNumberTaken = false;
    //   this.showPinField = false;
    //   this.disabledSignUp = true;
    //   this.phoneFieldHasMessage = false;

    //   if (number.length >= 9) {
    //     try {
    //       // console.log(number);
    //       // this.isSendingPinCode = true;

    //       if (regex.test(number)) {
    //         const available = await this.registrationService.CheckMobileNumberAvailability(phoneNumber);
    //         this.mobileNumberTaken = !available;
    //         // //console.log(available);
    //         if (available) {
    //           this.phoneFieldHasMessage = true;
    //           this.phoneFieldMessage = `Sending pin code to ${phoneNumber}`;
    //           this.phoneFieldMessageTextStatus = 'primary';
    //           const serverData = await this.registrationService.SendToken(phoneNumber);
    //           this.ideamartServerRef = serverData.data.data.serverRef;
    //           // console.log(`Server Ref :  ${this.ideamartServerRef}`);

    //           this.phoneFieldMessage = 'Enter the pin you recieved in the below box';
    //           this.phoneFieldMessageTextStatus = 'primary';
    //           this.showPinField = true;
    //           this.disabledSignUp = false;

    //           // console.log(serverData);
    //         } else {
    //           this.phoneFieldHasMessage = true;
    //           this.phoneFieldMessage = 'Phone Number is already used!';
    //           this.phoneFieldMessageTextStatus = 'danger';
    //         }
    //       } else {
    //         // this.form
    //       }
    //     } catch (error) {
    //       // console.log(error);

    //       this.phoneFieldMessage = `Unable to send pin to ${phoneNumber}`;
    //       this.phoneFieldMessageTextStatus = 'danger';
    //     }
    //   }
    // });


    this.confirmPassword.valueChanges.pipe(debounceTime(500)).subscribe(async password => {
      this.PasswordMatched = true;

      if (password.length != 0 && this.StrengthPassword !== password) {
        this.PasswordMatched = false;
      }

    });
  }

  get confirmPassword() {
    return this.registraionFormGroup.get('confirmPassword') as FormControl;
  }
  get email() {
    return this.registraionFormGroup.get('email') as FormControl;
  }

  get terms() {
    return this.registraionFormGroup.get('terms') as FormControl;
  }

  handleCardSpinner(show: boolean) {
    this.showSpinner = show;
  }

  async handleSignUp() {

    this.showRecaptchaError = false;

    this.registerErrorList = this.utilService.getFormValidationErrorList(this.registraionFormGroup, true);

    if (this.registraionFormGroup.valid && !this.emailTaken) {
      if (!this.humanResult) {
        this.showRecaptchaError = true;
        return;
      } else {
        try {

          this.handleCardSpinner(true);

          const formValues: IUserInfo = this.registraionFormGroup.value;
          formValues['access'] = 'user';

          // const optCode = formValues['otpCode'];

          // delete formValues['otpCode'];
          // formValues['phoneNumber'] = `94${formValues['phoneNumber']}`;

          const optCode = '';

          // try {
          // const optVerification = await this.registrationService.VerifyToken(optCode, this.ideamartServerRef);
          try {
            const registrationStatus = await this.registrationService.signUp(formValues, optCode, this.ideamartServerRef);

            // //console.log(registrationStatus);

            if (registrationStatus.success) {
              this.utilService.showSuccessToast('', 'Registration Success');
              this.registrationService.logoutSubscription.next(true);
              this.router.navigate(['/events']);
            } else {
              this.utilService.showErrorToast(registrationStatus.msg, 'Registration Failed');
              // this.registraionFormGroup.reset();
            }
          } catch (error) {
            this.utilService.showErrorToast(`Something went wrong`, 'Registration Failed');
            // this.registraionFormGroup.reset();
          }
          // } catch (error) {
          //   this.utilService.showErrorToast(`Try again`, 'Invalid Pin');
          //   // this.registraionFormGroup.reset();
          // }

          this.handleCardSpinner(false);
        } catch (error) {
          // //console.log(error);
          // alert(`Error has happened`);
          this.handleCardSpinner(false);
        }
      }

    } else {

      this.handleCardSpinner(false);
      // alert(`Form is not not valid`);
    }
  }


}
