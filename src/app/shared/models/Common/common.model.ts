export interface IFunctionResponse {
    success?: boolean;
    msg?: string;
    data?: any;
}

// export interface IFirebaseUserObject {
//     username: string;
//     email: string;
//     publicKey: string;
//     encryptedSecret: string;
//     access: string;

// }

export interface IUserInfo {
    username?: string;
    password?: string;
    email?: string;
    access?: string;
    phoneNumber?: string;
}


export interface IFirebaseUserObject {
    access?: string;
    email?: string;
    encryptedSecret?: string;
    events?: {
        bumbastic?: { ticketID: string },
        GAINIGHT?: { ticketID: string },
        GIOE?: { ticketID: string },
        CBM?: { ticketID: string },
        CBM2?: { ticketID: string },
        CBM3?: { ticketID: string },

    };
    publicKey?: string;
    username?: string;
    phoneNumber?: string;
    pash?: string;
    isRegistered?: boolean;
    pin?: string;
    serverRef?: string;
}

export interface IFirebaseTicketObject {
    emailHash?: string;
    eventID?: string;
    status?: string;
    ticketCount?: number;
}



