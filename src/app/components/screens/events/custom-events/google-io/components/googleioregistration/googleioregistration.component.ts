import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { debounceTime } from 'rxjs/operators';
import { UtilService } from 'src/app/shared/services/Common/util.service';
import { RegistrationService } from 'src/app/shared/services/Providers/registration.service';
import { StorageService } from 'src/app/shared/services/Storage/storgare.service';
import { Router } from '@angular/router';
import { ValidationQuestions } from './registration_questions/googleio.questions';

@Component({
  selector: 'app-googleioregistration',
  templateUrl: './googleioregistration.component.html',
  styleUrls: ['./googleioregistration.component.scss']
})
export class GoogleioregistrationComponent implements OnInit {
  registrationForm: FormGroup;

  formErrorList:any = {};

  // tshirtSizes
  tshirtSize = ['xs', 's', 'm', 'l', 'xl', '2xl', '3xl'];

  // Meal preference
  mealPreference = ['Vegetarian', 'Non-Vegetarian'];

  // profession
  professions = ['developer', 'designer', 'tester', 'devOps', 'UI/UX', 'entrepreneur', 'blockchain enthusiast', 'other'];


  // past year
  pastYears = ['2013', '2014', '2015', '2016', '2017', '2018'];


  userData = null;
  userPhoneNumber = '';
  randomQuestionList = [];

  formKeysOfQuestion = ['questionOne', 'questionTwo', 'questionThree', 'questionFour'];


  // Disable Button
  disableSubmitBtn = false;

  @Output() hideRegistrationEmitter = new EventEmitter<boolean>();

  // tslint:disable-next-line:max-line-length
  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private utilService: UtilService,
    private registrationService: RegistrationService, private storageService: StorageService) { }

  ngOnInit() {

    this.createForm();
    this.getRandomQuestions();
    const tokenData = this.utilService.getTokenData();
    if (tokenData) {
      this.userData = tokenData;
      //console.log(tokenData);

      this.userPhoneNumber = this.userData['phoneNumber'];
      //console.log(this.userPhoneNumber);
      this.registrationForm.get('phoneNumber').setValue(this.userPhoneNumber);

    } else {
      this.router.navigate(['/']);
    }
  }

  capitalize = s => {
    if (typeof s !== 'string') return '';
    return s.charAt(0).toUpperCase() + s.slice(1);
  }


  getFormControl(formControlName) {
    return this.registrationForm.get(formControlName);
  }


  getRandomQuestions() {

    //console.log(ValidationQuestions);
    const selectedNumbers = [];
    for (let index = 0; index < 4;) {

      const randomNumber = Math.floor(Math.random() * ValidationQuestions.length);

      if (!selectedNumbers.includes(randomNumber)) {
        selectedNumbers.push(randomNumber);
        const randomQuestion = ValidationQuestions[randomNumber];

        this.randomQuestionList.push(randomQuestion);
        index++;
      }

    }

    //console.log(`Selected Numbers`);

    //console.log(selectedNumbers);


  }

  buildPastEvent() {

    const yearFormControls = this.pastYears.map(year => {

      return new FormControl(false);

    });

    return new FormArray(yearFormControls);

  }

  createForm() {
    this.registrationForm = this.formBuilder.group({
      fname: ['', [Validators.required, Validators.maxLength(100)]],
      lname: ['', [Validators.required, Validators.maxLength(100)]],
      identification: ['', [Validators.required, Validators.maxLength(12), Validators.minLength(10)]],
      phoneNumber: [this.userPhoneNumber, [Validators.required, Validators.maxLength(100)]],
      workplace: ['', [Validators.required, Validators.maxLength(100)]],
      tshirtSize: ['', [Validators.required, Validators.maxLength(100)]],
      mealPreference: ['', [Validators.required, Validators.maxLength(100)]],
      linkedIn: [''],
      gitHub: [''],
      stackoverflow: [''],
      ideamart: [''],
      profession: ['', [Validators.required, Validators.maxLength(100)]],
      medium: [''],
      // eventPermission: ['eventPermission', [Validators.required]],
      selectionReason: ['', [Validators.required]],
      // previousAttendance: ['previousAttendance', [Validators.required]],
      pastYear: this.buildPastEvent(),
      acknowledgement: [false,[Validators.required]],
      questionOne: ['', [Validators.required, Validators.maxLength(100)]],
      questionTwo: ['', [Validators.required, Validators.maxLength(100)]],
      questionThree: ['', [Validators.required, Validators.maxLength(100)]],
      questionFour: ['', [Validators.required, Validators.maxLength(100)]],

    });

    this.registrationForm.valueChanges.pipe(debounceTime(500)).subscribe(data => {
      this.formErrorList = this.handleValidation(this.registrationForm);
      //console.log(this.formErrorList);

    });
  }

  get pastYearsList() {
    return this.registrationForm.get('pastYear') as FormArray;
  }


  disableSubmitButton() {
    this.disableSubmitBtn = true;
  }
  enableSubmitButton() {
    this.disableSubmitBtn = false;
  }
  async submitForm() {
    //  //console.log(this.registrationForm);


    if (!this.registrationForm.invalid) {
      // always invalid????

      this.disableSubmitButton()
      const postData = this.buildPostData();
      // console.log(postData);


      // return;

      try {

        let formResponse = await this.registrationService.SendRegForm(postData);

        if (formResponse == null) {
          this.utilService.showErrorToast(`Something went wrong. Check your form again`, 'Registration Failed');

          this.enableSubmitButton();
        } else {

          this.utilService.showSuccessToast(`You have been registered`, 'Registration Success');
          this.registrationForm.reset();
          this.hideRegistrationEmitter.emit(true);
          const jwt = await this.registrationService.GetAuthToken();
          if (jwt) {
            this.storageService.setJWT(jwt);

          }

          this.disableSubmitButton();
          // const newUserData = { ...userData, isRegistered: true };

        }
      } catch (error) {
        this.utilService.showErrorToast(`Something went wrong. Try again or contact us`, 'Registration Failed');
        this.enableSubmitButton();
      }

      //send postData to dynamodb (service => backend => db)
      //on success => update user object with isRegistered = true.

      // (if isRegistered = true ....show banner)
      // (if isRegistered = false ....show form to register)

    } else {
      //console.log(this.registrationForm);
      this.formErrorList = this.handleValidation(this.registrationForm, true);
      this.utilService.showErrorToast(`There are few errors in the form`, `Required fields missing`)
      this.enableSubmitButton();
    }

  }

  fillEmptyFields(data) {


    const postData = {};

    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        let element = data[key];

        if (element.length <= 0 && (typeof element == 'string')) {
          element = 'null';
        }
        postData[key] = element;
      }
    }

    return postData;
  }

  buildPostData() {
    const data = { ...this.registrationForm.value };

    // tslint:disable-next-line:max-line-length
    const pastYear = data['pastYear'].map((value, index) => { if (value == true) { return index; } }).filter(x => x != undefined).map(x => this.pastYears[x]);
    const user = this.storageService.getUser();
    data['pastYear'] = pastYear;
    data['email'] = user.email;

    this.formKeysOfQuestion.map((key, index) => {
      const currentQuestion = this.randomQuestionList[index];
      const selectedAnswer = currentQuestion.answers[data[key]];
      const question = currentQuestion.question;
      data[key] = `${question} : ${selectedAnswer}`;

    });

    const postData = this.fillEmptyFields(data);

    return postData;

  }

  handleValidation(formGroup: FormGroup, checkAll = false) {
    // return formControl.hasError(validation);

    const errorList = {};
    const formControlNames = Object.keys(formGroup.controls);

    for (const controlName of formControlNames) {
      const formControl = formGroup.get(controlName);

      //console.log(formControl.value);


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
}
