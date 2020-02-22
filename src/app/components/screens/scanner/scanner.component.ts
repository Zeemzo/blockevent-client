import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { ZXingScannerComponent } from '@zxing/ngx-scanner';
import { TicketService } from 'src/app/shared/services/Providers/ticket.service';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { UtilService } from 'src/app/shared/services/Common/util.service';

@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.component.html',
  styleUrls: ['./scanner.component.scss']
})
export class ScannerComponent implements OnInit {

  @ViewChild('scanner')
  scanner: ZXingScannerComponent;

  hasCameras = false;
  hasPermission: boolean;
  qrResultString: string;

  availableDevices: MediaDeviceInfo[];
  selectedDevice: MediaDeviceInfo;

  showSpinner = false;



  @ViewChild('verifyDialog', { read: TemplateRef }) verifyDialog: TemplateRef<any>;


  verifyModal: NbDialogRef<any>;

  scannedString = '';

  constructor(public ticketService: TicketService, private dialogService: NbDialogService, private utilService: UtilService) {

    this.scanner = new ZXingScannerComponent();

    this.scanner.camerasFound.subscribe((devices: MediaDeviceInfo[]) => {
      this.hasCameras = true;

      // //console.log('Devices: ', devices);
      this.availableDevices = devices;
      // this.onDeviceSelectChange('32ca340782978cd5844e7fe3c6daa83b73e6626b8e14450e37c0a5dbf58da3da')
      // this.onDeviceSelectChange('3fb5d803321d49ec23d8bcea9be7f488db19e9b2345327dfdb08daa4a5cc33cb')
      this.onDeviceSelectChange(devices[devices.length - 1].deviceId);

      // selects the devices's back camera by default
      // for (const device of devices) {
      //     if (/back|rear|environment/gi.test(device.label)) {
      //         this.scanner.changeDevice(device);
      //         this.selectedDevice = device;
      //         break;
      //     }
      // }
    });

    this.scanner.camerasNotFound.subscribe((devices: MediaDeviceInfo[]) => {
      console.error('An error has occurred when trying to enumerate your video-stream-enabled devices.');
    });

    this.scanner.permissionResponse.subscribe((answer: boolean) => {
      this.hasPermission = answer;
    });

  }



  ngOnInit(): void {

    this.scanner.camerasFound.subscribe((devices: MediaDeviceInfo[]) => {
      this.hasCameras = true;

      // //console.log('Devices: ', devices);
      this.availableDevices = devices;
      // this.onDeviceSelectChange('32ca340782978cd5844e7fe3c6daa83b73e6626b8e14450e37c0a5dbf58da3da')
      // this.onDeviceSelectChange('3fb5d803321d49ec23d8bcea9be7f488db19e9b2345327dfdb08daa4a5cc33cb')
      this.onDeviceSelectChange(devices[devices.length - 1].deviceId);

      // selects the devices's back camera by default
      // for (const device of devices) {
      //     if (/back|rear|environment/gi.test(device.label)) {
      //         this.scanner.changeDevice(device);
      //         this.selectedDevice = device;
      //         break;
      //     }
      // }
    });

    this.scanner.camerasNotFound.subscribe((devices: MediaDeviceInfo[]) => {
      console.error('An error has occurred when trying to enumerate your video-stream-enabled devices.');
    });

    this.scanner.permissionResponse.subscribe((answer: boolean) => {
      this.hasPermission = answer;
    });

  }


  async verifyTicket() {

    try {
      this.showSpinner = true;

      const qrObject = JSON.parse(this.scannedString);
      const success = await this.ticketService.submitToStellar(qrObject.xdr);

      const success1 = success ? await this.ticketService.approveTicket(qrObject.ticketID) : false;

      if (success && success1) {
        this.verifyModal.close();
        this.utilService.showSuccessToast('Ticket has been verified', '');

      } else {
        this.verifyModal.close();
        this.utilService.showErrorToast('Ticket has already been used', '');

      }
      this.showSpinner = false;

      this.verifyModal.close();
    } catch (error) {

      this.verifyModal.close();
      this.utilService.showErrorToast('Something went wrong', 'Ooops...');
      this.showSpinner =false;

    }

  }


  handleQrCodeResult(resultString: string) {
    // //console.log('Result: ', resultString);

    this.scannedString = resultString;
    this.verifyModal = this.dialogService.open(this.verifyDialog);

    // this.ticketService.submitToStellar(resultString).then((res) => {

    //   // //console.log('Ticket Submitted');
    //   // //console.log(res);
    // }).catch((err) => {
    //   // //console.log(err);

    // });
    // this.qrResultString = resultString;
    // this.submitToStellar(resultString);
  }

  onDeviceSelectChange(selectedValue: string) {
    // //console.log('Selection changed: ', selectedValue);
    this.selectedDevice = this.scanner.getDeviceById(selectedValue);
  }

}
