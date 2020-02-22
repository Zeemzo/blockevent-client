import { Injectable } from '@angular/core';
import { User } from 'firebase';

@Injectable({
    providedIn: 'root'
})
export class StorageService {



    private STORAGE_KEYS = {
        user: 'user',
        ticket: 'ticket',
        jwt:'jwt'
    };

    getItem(key: string) {
        return JSON.parse(localStorage.getItem(key))
    }

    addItem(key: string, data: any) {
        localStorage.setItem(key, data)
    }

    addObject(key: string, object: any) {
        const data = JSON.stringify(object);
        localStorage.setItem(key, data);
    }

    getUser() {
        const userData = this.getItem(this.STORAGE_KEYS.user);
        return userData;
    }

    setUser(user: any) {

        // //console.log(user);
        if (user == null) {
            this.addItem(this.STORAGE_KEYS.user, user);
        } else {
            this.addObject(this.STORAGE_KEYS.user, user);
        }


    }


    getJWT() {
        const jwt = this.getItem(this.STORAGE_KEYS.jwt);
        return jwt;
    }

    setJWT(jwt: any) {

        // //console.log(user);
        if (jwt == null) {
            this.addItem(this.STORAGE_KEYS.jwt, jwt);
        } else {
            this.addObject(this.STORAGE_KEYS.jwt, jwt);
        }


    }

    getTicket() {
        const ticketData = this.getItem(this.STORAGE_KEYS.ticket);
        return ticketData;
    }

    setTicket(ticket: any) {

        // //console.log(ticket);


        if (ticket == null) {
            this.addItem(this.STORAGE_KEYS.ticket, ticket);
        } else {
            this.addObject(this.STORAGE_KEYS.ticket, ticket);
        }


    }

    removeUser() {
        localStorage.removeItem(this.STORAGE_KEYS.user);
        localStorage.removeItem(this.STORAGE_KEYS.ticket);
        localStorage.removeItem(this.STORAGE_KEYS.jwt);

    }


}
