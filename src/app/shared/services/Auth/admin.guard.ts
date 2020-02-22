import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { StorageService } from 'src/app/shared/services/Storage/storgare.service';

@Injectable()
export class AdminGuardService implements CanActivate {
    constructor(public storageService: StorageService, public router: Router) { }
    canActivate(): boolean {
        const user = this.storageService.getUser();

        if (user == null) {
            this.router.navigate(['/']);
            return false;
        } else {
            if (user.access == 'boss') {
                return true;
            }
            this.router.navigate(['/']);
            return false;

        }

    }
}
