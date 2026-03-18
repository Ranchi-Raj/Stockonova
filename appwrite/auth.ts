import conf from '../conf/conf';
import { Client, Account, ID, Databases, Query, OAuthProvider} from 'appwrite';
import {toast} from "react-hot-toast"
export class AuthService{
    client = new Client();
    databases;
    account;

    constructor(){
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId)
            // .setDevKey("standard_1077c8e82772b3b2df7cce4443b045f0aa3d12fdeae175926f5ae956363b71370bb93af77578b96543bfbcc30bb2d27dce9039a0c36034a9801d90056281ca1bfe79b9ed7865428e99bec9595ce028b80d508bcc32d7c2c1a3ec9ed44f3b285517d77bdf9aaa0fe5798a6a066e62f126aef4399e168aa205bd6b9e35581af009");
        this.account = new Account(this.client);
        this.databases = new Databases(this.client);
    }

    async signup({name, email, password, phone} : {name: string, email: string, password: string, phone: string}){
            console.log("Signup called");
            console.log(this.account ? "Account created" : "Account not created");

            if(phone.length !== 10){
                throw new Error("Invalid phone number");
            }
        try{

            const resp = await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteUserId,
                [
                    Query.equal('phone', phone),
                    Query.equal('email', email)
                ]
            );

            if(resp.documents.length > 0){
                throw new Error("Phone number or email already exists");
            }

            const user = await this.account.create(ID.unique(), email, password, name);
            if(user){
                console.log("User idhar signup hogya")
                //function
                return this.login({email, password});
            }
            else{
                return user;
            }
        }
        catch(error){
            console.log("Signup error");
            throw error;
        }
    }

    async login({email, password} : {email: string, password: string}){
        try{
            const data=  await this.account.createEmailPasswordSession(email, password);
            if(data){
                console.log("User idhar login hogya")
                return data;
            }
        }
        catch(error){
            console.log("Login error");
            toast.error("Login failed, please check your credentials and try again.");
           throw error
        }
    }

    async signInWithGoogle(){
        try{
            this.account.createOAuth2Session({
                provider: OAuthProvider.Google ,
                success: `${conf.appUrl}/dashboard`,
                failure: `${conf.appUrl}/login`
            });
        }
        catch(error){
            console.log("Sign in with Google error");
            throw error;
        }
    }

    async logout(){
        try{
            console.log("Logout called");
            return await this.account.deleteSessions();
        }
        catch(error){
            console.log("Logout error");
            throw error;
        }
    }

    async getUser(){
        try{
            return await this.account.get();
        }
        catch(error){
            console.log("Get User error",error);
        }

        return null;
    }

    async sendPasswordReset(email : string) {
    try {
        const res = await this.account.createRecovery({
        email,
        url : `${conf.appUrl}/reset-password`
        // url: "https://stocknova.co.in/reset-password" // Your reset page
        });

        return res; 
    } catch (err) {
        console.error(err);
        throw err;
    }
    }
    async resetPassword({ userId, secret, newPassword } : { userId: string, secret: string, newPassword: string }) {
        try {
            const res = await this.account.updateRecovery({
            userId,
            secret,
            password: newPassword,
            });

            return res;
        } catch (err) {
            console.error(err);
            throw err;
        }
        }
}
const authService = new AuthService();

export default authService;