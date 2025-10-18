import conf from '../conf/conf';
import { Client, Account, ID, Databases, Query, OAuthProvider} from 'appwrite';

export class AuthService{
    client = new Client();
    databases;
    account;

    constructor(){
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId)
            
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
           throw error
        }
    }

    async signInWithGoogle(){
        try{
            this.account.createOAuth2Session({
                provider: OAuthProvider.Google ,
                success: `${conf.appUrl}/dashboard`,
                failure: `${conf.appUrl}/`
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
}
const authService = new AuthService();

export default authService;