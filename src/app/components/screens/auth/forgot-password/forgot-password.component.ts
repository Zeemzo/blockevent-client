import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import { RegistrationService } from "src/app/shared/services/Providers/registration.service";
import { IUserInfo } from "src/app/shared/models/Common/common.model";
import { UtilService } from "src/app/shared/services/Common/util.service";
import { Router } from "@angular/router";
import { debounceTime } from "rxjs/operators";

// var Regex = require("regex");

var setup = require("hsimp-purescript");
var characterSets = require("hsimp-purescript/dictionaries/character-sets.json");
var periods = require("hsimp-purescript/dictionaries/periods.json");
var namednumbers = require("hsimp-purescript/dictionaries/named-numbers.json");
var top10k = require("hsimp-purescript/dictionaries/top10k.json");
var patterns = require("hsimp-purescript/dictionaries/patterns.json");
var checks = require("hsimp-purescript/dictionaries/checks.json");

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  registraionFormGroup: FormGroup;


  readyToReset = false;


  mobileNumberTaken = false;
  emailUnused = false;
  showSpinner = false;
  PasswordStrength: null;
  StrengthPassword = '';
  ConfirmPassword = '';
  PasswordMatched = true;
  ShowPassword = false;

  phoneFieldHasMessage = false;
  showPinField = false;

  phoneFieldMessage = '';
  phoneFieldMessageTextStatus = 'muted';

  ideamartServerRef = null;
  disabledSignUp = true;

  registerErrorList: any = {};

  showSignUpBtn = false;

  // tslint:disable-next-line:max-line-length
  constructor(private formBuilder: FormBuilder,
    private registrationService: RegistrationService,
    private utilService: UtilService,
    private router: Router) { }

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
      this.buildRegisrationForm();
    } catch (error) {
      // //console.log(error);

      // //console.log(`Error Message`);

      console.error(error.message);
    }
  }

  async checkEmailAvaialbility() {
    //console.log(`This has been called`);
    this.emailUnused = false;

    const formValues: IUserInfo = this.registraionFormGroup.value;
    const regex = new RegExp('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$');

    if (regex.test(formValues['email'])) {

      const response = await this.registrationService.GetMobileForEmail(formValues['email']);
      if (response == null) {
        // the 
        this.emailUnused = true;

      } else {
        this.readyToReset = true;
        this.phoneNumber.setValue(response.phoneNumber.substring(2));
        this.username.setValue(response.username);

      }
      //console.log(available);
    }
  }

  buildRegisrationForm() {
    this.registraionFormGroup = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      otpCode: ['', Validators.required],
      terms: [false, Validators.required]
    });


    this.terms.valueChanges.pipe(debounceTime(500)).subscribe(isSelected => {

      if (isSelected && this.disabledSignUp) {

        this.showSignUpBtn = true;

      }

    });

    this.phoneNumber.valueChanges.pipe(debounceTime(500)).subscribe(async phoneNumber => {


      this.phoneFieldHasMessage = true;
      this.phoneFieldMessage = `Sending pin code to +94 XXX XXX ${phoneNumber.substring(8)}`;
      this.phoneFieldMessageTextStatus = 'primary';
      const serverData = await this.registrationService.SendToken(`94${phoneNumber}`);
      if (serverData != null) {
        this.ideamartServerRef = serverData.data.data.serverRef;
        //console.log(`Server Ref :  ${this.ideamartServerRef}`);

        this.phoneFieldMessage = `Enter the OTP Code sent to +94 XXX XXX ${phoneNumber.substring(6)} in the below box`;
        this.phoneFieldMessageTextStatus = 'primary';
        this.showPinField = true;
        this.disabledSignUp = false;

      }

    });


    this.confirmPassword.valueChanges.pipe(debounceTime(500)).subscribe(async password => {
      this.PasswordMatched = true;

      if (password.length !== 0 && this.StrengthPassword !== password) {
        this.PasswordMatched = false;
      }

    });
  }

  get confirmPassword() {
    return this.registraionFormGroup.get('confirmPassword') as FormControl;
  }
  get phoneNumber() {
    return this.registraionFormGroup.get('phoneNumber') as FormControl;
  }

  get username() {
    return this.registraionFormGroup.get('username') as FormControl;
  }

  get terms() {
    return this.registraionFormGroup.get('terms') as FormControl;
  }

  handleCardSpinner(show: boolean) {
    this.showSpinner = show;
  }

  async handleSignUp() {
    this.handleCardSpinner(true);


    this.registerErrorList = this.utilService.getFormValidationErrorList(this.registraionFormGroup, true);

    if (this.registraionFormGroup.valid) {
      try {
        const formValues: IUserInfo = this.registraionFormGroup.value;
        formValues['access'] = 'user';

        const optCode = formValues['otpCode'];

        delete formValues['otpCode'];
        formValues['phoneNumber'] = `94${formValues['phoneNumber']}`;

        // try {
        // const optVerification = await this.registrationService.VerifyToken(optCode, this.ideamartServerRef);
        try {
          const registrationStatus = await this.registrationService.signUpdate(formValues, optCode, this.ideamartServerRef);

          // //console.log(registrationStatus);

          if (registrationStatus.success) {
            this.utilService.showSuccessToast('', 'Update Success');
            this.registrationService.logoutSubscription.next(true);
            this.router.navigate(['/events']);
          } else {
            this.utilService.showErrorToast(registrationStatus.msg, 'Update Failed');
            // this.registraionFormGroup.reset();
          }
        } catch (error) {
          this.utilService.showErrorToast(`Something went wrong`, 'Update Failed');
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
    } else {
      this.handleCardSpinner(false);
      // alert(`Form is not not valid`);
    }
  }


}
