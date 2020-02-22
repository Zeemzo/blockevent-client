import { Injectable } from '@angular/core';
import * as sha256 from 'sha256';
// import firebase from './connection';
import { EventSourcePolyfill } from 'ng-event-source';
import { backend } from 'src/environments/environment';
import { StorageService } from 'src/app/shared/services/Storage/storgare.service';

import { Network, Server, Keypair, Asset, TransactionBuilder, Operation, Transaction } from 'stellar-sdk';
import * as axios from 'axios';
import { AngularFireDatabase } from '@angular/fire/database';
import { forEach } from '@angular/router/src/utils/collection';
import * as firebase from 'firebase';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class TicketService {
    // private eventSource: EventSourcePolyfill;
    server: Server;
    poolAccountPublicKey = 'GDFZCD37V7YBWQWDNRA5UUQ2FJ2OHY5OBO7TUSZWD3PPQGANHRCM5DNI';
    distributorAccountPublicKey = 'GCMLRH3SZT4R7DYYXW2ILWJFNC3O6W6EYZUH2KRAAW3T4LIGJORYD2HS';


    private firebase: firebase.database.Database;
    constructor(private http: HttpClient, private firebaseDatabase: AngularFireDatabase,
        private storageService: StorageService) {
        // this.eventSource = new EventSourcePolyfill('/subscribe', { heartbeatTimeout: 1000, connectionTimeout: 1000 });

        this.server = new Server('https://horizon-testnet.stellar.org');
        Network.useTestNetwork();
        this.firebase = this.firebaseDatabase.database;

    }

    async submitToStellar(xdr) {
        try {

            const parsedTx = new Transaction(xdr);

            const transactionResult = await this.server.submitTransaction(parsedTx);

            // //console.log(transactionResult);
            return true;

        } catch (error) {
            // //console.log(error.response);
            return false;
        }

    }

    async sendTicket(senderSecretKey) {

        try {

            const senderKeys = Keypair
                .fromSecret(senderSecretKey);
            //console.log('point 1');

            const CBDM = new Asset('CBM3', 'GARKZQ7AEQRLDXDYDAVRX774ACC5WLIDIA7JUIWC5SNDRY23TSZGOPZK');
            //console.log('point 2');

            const senderObj = await this.server.loadAccount(senderKeys.publicKey());

            //console.log('point 3');

            const minTime = Math.round(new Date().getTime() / 1000.0);
            // var myDate = new Date("July 1, 1978 02:30:00"); // Your timezone!
            const maxTime = Math.round((new Date().getTime() + (5 * 60 * 1000)) / 1000.0);

            const opts = { timebounds: { minTime: minTime, maxTime: maxTime } };

            const transaction = new TransactionBuilder(senderObj, opts)
                .addOperation(Operation.payment({
                    destination: this.poolAccountPublicKey.toString(),
                    asset: CBDM,
                    amount: '1',
                }))
                .addOperation(Operation.changeTrust({
                    asset: CBDM,
                    limit: '0'
                })).build();
            transaction.sign(senderKeys);
            // console.log(transaction.toEnvelope().toXDR('base64'));
            const xdr = transaction.toEnvelope().toXDR('base64');

            //console.log('point 4');

            return xdr.toString('utf8');

        } catch (error) {
            // //console.log('Error!', error);
            return null;

        }

    }


    handleTransactionBuilder(senderObj, CBDM, receiver, senderKeys) {
        const transaction = new TransactionBuilder(senderObj)
            // The `changeTrust` operation creates (or alters) a trustline
            // The `limit` parameter below is optional

            .addOperation(Operation.changeTrust({
                asset: CBDM,
                limit: '1'
            }))
            // transaction.addOperation(Operation.manageData({ name: 'proofHash', value: 'proofHash', source: receiver }))
            .addOperation(Operation.payment({
                destination: receiver,
                asset: Asset.native(),
                amount: '10',
            }))
            .addOperation(Operation.payment({
                destination: senderKeys.publicKey(),
                asset: CBDM,
                amount: '1',
                source: receiver
            }))

            .build();
        transaction.sign(senderKeys);
        // //console.log(transaction);
        // //console.log('XDR............');
        // //console.log(transaction.toEnvelope().toXDR('base64'));
        const xdr = transaction.toEnvelope().toXDR('base64');
        return xdr;
    }

    async getTicketByTrustline(senderSecretKey, eventID, email) {

        try {
            // //console.log(senderSecretKey);

            const receiver = this.distributorAccountPublicKey;
            const senderKeys = Keypair
                .fromSecret(senderSecretKey);



            // var receivingKeys = StellarSdk.Keypair
            //   .fromSecret('SDNW4TVMRPTO7NPSBYHYA2ESHOWQLQLOVDN3AKW6Q65YOVT7DIC3KYPO');

            // Create an object to represent the new asset
            const CBDM = new Asset('CBM3', 'GARKZQ7AEQRLDXDYDAVRX774ACC5WLIDIA7JUIWC5SNDRY23TSZGOPZK');

            // First, the receiving account must trust the asset
            const account = await this.server.loadAccount(senderKeys.publicKey());
            const xdr = this.handleTransactionBuilder(account, CBDM, receiver, senderKeys);

            const response = await this.submitTransactionToSigner(xdr, eventID, email);

            // //console.log(response);


            if (response.data.status == 201) {
                // //console.log(`response was successs`);

                return true;
            } else {
                // //console.log(`Response failed`);

                return false;
            }


        } catch (error) {

            // //console.log(error);

            return false;


        }


    }

    submitTransactionToSigner(XDR, eventID, email) {

        // axios.default.post(`http://localhost:7000/api/signTicket`, {
        return axios.default.post(`${backend}/api/ticket/signTicket`, {

            'xdr': XDR,
            'eventID': eventID,
            'emailHash': this.hashEmail(email.toLowerCase()),
            'email': email,
        }, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.storageService.getJWT().token}`

            }
        });

    }

    getTicketByUserAndEvent(emailHash, eventID) {
        return new Promise((resolve, reject) => {
            this.firebase.ref('/tickets/')
                .orderByChild('emailHash')
                .equalTo(emailHash)
                .once('value')
                .then((snapshot) => {
                    const ticketsListOfUser = snapshot.val();
                    // tslint:disable-next-line:prefer-const
                    let arr = [];
                    // tslint:disable-next-line:forin
                    for (const key in ticketsListOfUser) {
                        ticketsListOfUser[key].ticketID = key;
                        arr.push(ticketsListOfUser[key]);
                    }
                    // // //console.log(ticketsListOfUser);
                    // // //console.log(arr);

                    arr.forEach((ticket) => {
                        if (ticket.eventID == eventID) {
                            resolve(ticket);
                        }
                    });
                    reject({ message: 'No Tickets Found' });
                }).catch((err) => {
                    reject(err);
                });
        });
    }

    getTicketsByUser(emailHash) {
        return new Promise((resolve, reject) => {
            this.firebase.ref('/tickets/')
                .orderByChild('emailHash')
                .equalTo(emailHash)
                .once('value')
                .then((snapshot) => {
                    const ticketsListOfUser = snapshot.val();
                    // tslint:disable-next-line:prefer-const
                    let arr = [];
                    // tslint:disable-next-line:forin
                    for (const key in ticketsListOfUser) {
                        ticketsListOfUser[key].ticketID = key;
                        arr.push(ticketsListOfUser[key]);
                    }
                    // // //console.log(ticketsListOfUser);
                    // // //console.log(arr);
                    resolve(arr);

                }).catch((err) => {
                    reject(err);
                });
        });
    }

    getTicketToDisplay() {
        try {
            this.firebase.ref('/tickets/')
                .orderByChild('emailHash')
                .once('value')
                .then((snapshot) => {
                    const ticketsListOfUser = snapshot.val();
                    const arr = [];
                    // tslint:disable-next-line:forin
                    for (const key in ticketsListOfUser) {
                        ticketsListOfUser[key].ticketID = key;
                        arr.push(ticketsListOfUser[key]);
                    }
                    // // //console.log(ticketsListOfUser);
                    // //console.log(arr);
                    return arr;
                }).catch((err) => {
                    return null;
                });
        } catch (error) {
            return null;
        }
    }
    getTicketXDRByID(ticketID) {
        return new Promise((resolve, reject) => {
            this.firebase.ref(`/tickets/${ticketID}`)
                .once('value')
                .then((snapshot) => {
                    const ticket = snapshot.val();
                    resolve(ticket.XDR);

                }).catch((err) => {
                    reject(err);
                });
        });
    }
    approveTicket(ticketID) {
        try {
            // this.firebase.ref(`/tickets/${ticketID}`)
            //     .update({
            //         status: 'approved',
            //         ticketCount: -1
            //     });

            return axios.default.post(`${backend}/api/ticket/approve`, {
                ticketID: ticketID
            }, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.storageService.getJWT().token}`
                }
            });


            return true;
        } catch (error) {
            return false;
        }
    }

    sendXDRIntoTicket(TicketID, XDR) {
        return new Promise((resolve, reject) => {
            this.firebase.ref(`/tickets/${TicketID}`)
                .update({
                    XDR: XDR
                })
                .then((snapshot) => {
                    resolve({ message: 'Success' });
                }).catch((err) => {
                    reject(err);
                });

        });
    }
    hashEmail(email) {
        return sha256(email);
    }


}

