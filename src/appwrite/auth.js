import conf from '../conf/conf';
import { Client, Account, ID } from "appwrite";

export class AuthService{
    client = new Client();
    account;

    constructor(){
        this.client
            .setEndpoint(conf.appWriteUrl) // Your API Endpoint
            .setProject(conf.appWriteProjectId); 
        this.account = new Account(this.client);
    }
    //for signup
    async createAccount({email,password,name}){
        try{
            const userAccount=await this.account.create(ID.unique(),email,password,name);
            //automatic login by signup
            if(userAccount){
                return this.login({email,password});
            }
            else{
                return userAccount;
            }
        }
        catch(error){
            throw error;
        }
    }
    //for login
    async login({email,password}){
        try {
            return await this.account.createEmailSession(email,password);
        } catch (error) {
            throw error;
        }
    }
    //for getting current user in home page
    async getCurrentUser(){
        try {
            return await this.account.get();
        } catch (error) {
            console.log("Appwrite service::getCurrentUser::error",error);
        }
        return null;
    }
    //for logout
    async logout(){
        try {
            await this.account.deleteSession();
        } catch (error) {
            console.log("Appwrite service::error",error)
        }
    }
}
const authService = new AuthService();

export default authService;