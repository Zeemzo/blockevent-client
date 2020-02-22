
import { Component, OnInit } from '@angular/core';
import { StorageService } from 'src/app/shared/services/Storage/storgare.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private storageService: StorageService) { }

  showLogin = false;
  ngOnInit() {

    const userObject = this.storageService.getUser();
    if (userObject == null) {
      this.showLogin = true;
    } else {
      this.showLogin = false;
    }


  }

}
