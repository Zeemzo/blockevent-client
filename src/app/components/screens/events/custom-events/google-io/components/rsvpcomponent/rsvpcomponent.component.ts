import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilService } from 'src/app/shared/services/Common/util.service';
import { RegistrationService } from 'src/app/shared/services/Providers/registration.service';
import { StorageService } from 'src/app/shared/services/Storage/storgare.service';

@Component({
  selector: 'app-rsvpcomponent',
  templateUrl: './rsvpcomponent.component.html',
  styleUrls: ['./rsvpcomponent.component.scss']
})
export class RsvpcomponentComponent implements OnInit {


  rsvpFormGroup: FormGroup;


  formErrorList: any = {};

  buttonText = 'Submit';
  disableButton = false;

  provinceList = [

    'Central Province',

    'Eastern Province',

    'North Central Province',

    'North Western Province',

    'Northern Province',
    'Sabaragamuwa Province',

    'Southern Province',

    'Uva Province',

    'Western Province',


  ];

  @Input('alreadySubmitted') alreadySubmitted = false;

  constructor(private fb: FormBuilder,
    private utilService: UtilService,
    private registrationService: RegistrationService,
    private storageService: StorageService) { }

  async ngOnInit() {
    this.createForm();


    this.rsvpFormGroup.valueChanges.subscribe(data => {

      this.formErrorList = this.utilService.getFormValidationErrorList(this.rsvpFormGroup);
    });
  }

  formatAddress(address) {

    const { addressLineOne, addressLineTwo, city, postalcode } = address;
    return `${addressLineOne},${addressLineTwo},${city} ${postalcode}`;

  }

  async handleSubmit() {


    this.formErrorList = this.utilService.getFormValidationErrorList(this.rsvpFormGroup, true);
    //console.log('TCL: RsvpcomponentComponent -> handleSubmit -> this.formErrorList', this.formErrorList);


    //console.log(this.rsvpFormGroup);

    //console.log(this.rsvpFormGroup.value);

    //console.log();

    this.buttonText = 'Submitting';
    this.disableButton = true;

    if (!this.rsvpFormGroup.invalid) {


      try {
        const user = this.storageService.getUser();
        const address = JSON.stringify(this.rsvpFormGroup.value);
        // const address = this.formatAddress(this.rsvpFormGroup.value);
        const addressAdded = await this.registrationService.AddAddress(user['email'], address);

        if (addressAdded) {

          this.utilService.showSuccessToast(`Address Updated`, `Address Updated`);
          this.rsvpFormGroup.reset();
          this.alreadySubmitted = true;
        } else {
          this.utilService.showSuccessToast(`Address updated failed`, `Oops... Something went wrong`);

        }

      } catch (error) {
        //console.log(error);
        this.utilService.showErrorToast('Opps.. Something went wrong', 'Address Update failed');
      }

    }

    this.buttonText = 'Submit';
    this.disableButton = false;
  }

  createForm() {
    this.rsvpFormGroup = this.fb.group({
      addressLineOne: ['', Validators.required],
      addressLineTwo: [''],
      city: ['', Validators.required],
      province: ['', Validators.required],
      postalcode: ['', Validators.required],
    });

  }

}
