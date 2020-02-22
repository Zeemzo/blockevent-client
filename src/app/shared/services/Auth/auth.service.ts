import { Injectable } from '@angular/core';
import { IUser, IAuthResult } from '../../models/Auth/user.model';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/shared/services/Storage/storgare.service';
import { Observable } from 'rxjs';


@Injectable({
    providedIn: 'root'
})

export default class AuthService {


    private user: Observable<IUser>;


    // tslint:disable-next-line:max-line-length
    constructor(private firebaseAuth: AngularFireAuth, private router: Router, private storageService: StorageService, private firestore: AngularFirestore) {

        //    this.user=this.firebaseAuth.authState.subscribe(user =>{

        //         // //console.log(`Auth User`);
        //         // //console.log(user);


        //         if(user){
        //             this.storageService.setUser(user)

        //             this.user=user;
        //         }else{
        //             this.storageService.setUser(null);
        //         }

        //     })


    }

    setUserDocument(user: IUser) {

        const userRef: AngularFirestoreDocument<IUser> = this.firestore.doc(`users/${user.uid}`)

        const data: IUser = {
            uid: user.uid,
            email: user.email
        }

        return userRef.set(data);


    }

    async login(email: string, password: string): Promise<IAuthResult> {

        const authResults: IAuthResult = {
            loggedIn: false
        }

        try {
            await this.firebaseAuth.auth.signInWithEmailAndPassword(email, password);
            authResults.data = this.storageService.getUser();
            authResults.loggedIn = true;

            return authResults;

        } catch (error) {
            authResults.message = error.message;
            return authResults;
        } 


    }




    async regiser(email: string, password: string): Promise<IAuthResult> {

        const authResults: IAuthResult = {
            registered: false
        }

        try {

            const userData = await this.firebaseAuth.auth.createUserWithEmailAndPassword(email, password) as IUser
            authResults.message = 'User Created!'
            authResults.registered = true;
            this.setUserDocument(userData);
            return authResults;
        } catch (error) {

            authResults.message = error.message;
            return authResults;

        }
    }

}