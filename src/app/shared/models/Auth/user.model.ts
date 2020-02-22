export interface IUser{
    uid?:string,
    email?:string,
    password?:string,
}


export interface IAuthResult{
    loggedIn?:boolean;
    registered?:boolean;
    data?:any,
    message?:string;

}