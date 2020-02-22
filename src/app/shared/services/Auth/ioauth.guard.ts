import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { StorageService } from '../Storage/storgare.service';

@Injectable()
export class IoAuthGuardService implements CanActivate {
    constructor(public storageService: StorageService, public router: Router) { }
    canActivate(): boolean {
        const user = this.storageService.getUser();
            
        if (user == null) {
             this.router.navigate(['/login']);
            return false;
        } else {
            return true;
        }

    }
}
