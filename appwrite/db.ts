import conf from '../conf/conf'
import { Client, Databases, Account, ID, Query } from 'appwrite';
import { SessionInterface } from '../interfaces/interface'
class DBService{
    client = new Client();
    databases;
    account;
    constructor(){
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId)
        this.databases = new Databases(this.client);
        this.account = new Account(this.client);
    }

    async addUser({name, email, phone} : {name: string, email: string, phone: string}){
        try{
            const data = await this.databases.createDocument(
                conf.appwriteDatabaseId, conf.appwriteUserId, ID.unique(), {
                name: name,
                email: email,
                phone: phone,
                expert: false

            });
            console.log(data);
            return data;
        }
        catch(err){
            console.log(err);
            return err;
            }
    }

    async getUserByEmail(email: string){
        try{
            const resp = await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteUserId,
                [
                    // Query.equal('phone', phone),
                    Query.equal('email', email)
                ]
            );
            console.log(resp.documents[0]);
            return resp.documents[0];
        }
        catch(err){
            console.log(err);
            return err;
        }
    }

    async doesUserExists(email : string){
        try{
            const resp = await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteUserId,
                [
                    // Query.equal('phone', phone),
                    Query.equal('email', email)
                ]
            );
            if(resp.documents.length > 0){
                return true;
            }
            else{
                return false;
            }
        }
        catch(err){
            console.log(err);
            return false;
        }
    }

    async getExperts(){
        try{
            const resp = await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteUserId,
                [
                    Query.equal('expert', true)
                ]
            );
            console.log(resp.documents);
            return resp.documents;
        }
        catch(err){
            console.log(err);
            return err;
        }
    }

    async updateUserToExpert(id : string){
        try{
            const data = await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteUserId,
                id,
                {
                    expert: true
                }
            );
            console.log(data);
            return data;
        }
        catch(err){
            console.log(err);
            return err;
        }
    }

    async addRequest({userId ,name, email, sebiId, experience, specialization, bio} : {userId: string, name: string, email: string, sebiId: string, experience: number, specialization: string, bio: string}){
        try{
            const data = await this.databases.createDocument(
                conf.appwriteDatabaseId, conf.appwriteRequestId, ID.unique(), {
                userId: userId,
                name: name,
                email: email,
                sebiId: sebiId,
                experience: experience,
                specialization: specialization,
                bio: bio,
            });
            console.log(data);
            return data;
        }
    catch(err){
        console.log(err);
        return err;
        }
    }

    async getRequests(){
        try{
            const resp = await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteRequestId,
                [
                    
                    // Query.equal('expert', true)
                ]
            );            
            console.log(resp.documents);
            return resp.documents;
        }
        catch(err){
            console.log(err);
            return err;
        }
    }

    async deleteRequest(id: string){
        try{
            const resp = await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteRequestId,
                id
            );
            return resp;
        }
        catch(err){
            console.log(err);
            return err;
        }
    }

    async getAllUsers(){
    try{
        const resp = await this.databases.listDocuments(
            conf.appwriteDatabaseId,
            conf.appwriteUserId,
            []
        );
        
        // Get all unique sebi IDs
        const sebiIds = [...new Set(resp.documents.map(user => user.sebi).filter(Boolean))];
        
        // Fetch all sebi documents in one go
        const sebiDocsMap = new Map();
        if (sebiIds.length > 0) {
            const sebiResponse = await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                'sebi', // Replace with your actual sebi collection ID
                [
                    Query.limit(100) // Adjust limit as needed
                ]
            );
            
            // Create a map for easy lookup
            sebiResponse.documents.forEach(doc => {
                sebiDocsMap.set(doc.$id, doc);
            });
        }
        
        // Merge users with their sebi documents
        const usersWithSebi = resp.documents.map(user => ({
            ...user,
            sebi: user.sebi ? sebiDocsMap.get(user.sebi) || null : null
        }));
        
        return usersWithSebi;
    }
    catch(err){
        console.log(err);
        return err;
    }
    }

    async getUserbyId(id: string){
        try{
            const resp = await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteUserId,
                id,
                // ["sebi"]
            );
            const sebi = await this.getSebiById(resp.sebi)
            return {...resp, sebi :sebi};
            // return resp;
        }
        catch(err){
            console.log(err);
            return err;
        }
    }  
    
    async addSebiDetails({userId, sebiId,bio, earnings, experience, specialization} : {userId: string, sebiId: string, bio: string, earnings: number, experience: number, specialization: string}){
        try{
            const data = await this.databases.createDocument(
                conf.appwriteDatabaseId, conf.appwriteSebiId, ID.unique(), {
                userId: userId,
                sebiId: sebiId,
                // verified: verified,
                bio: bio,
                earnings: earnings,
                experience: experience,
                specialization: specialization,
            });
            console.log(data);

            const resp = await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteUserId,
                userId,
                {
                    sebi: data
                    //TODO sebi : data.$id
                }
            );
            console.log(resp);
            return data;
        }
        catch(err){
            console.log(err);
            return err;
        }
    }

    async getSebiById(id: string){
        try{
            const resp = await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteSebiId,
                id
            );

            return resp;
        }
        catch(err){
            console.log(err);
            return err;
        }
    }

    // Add the expert user ID in the users who have watched the expert intro video
    async addIntroInUser({id, expertId, intros} : {id: string, expertId: string, intros: string[]}){
        try{
            const resp = await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteUserId,
                id,
                {
                    intros: [...intros, expertId]
                }
            );
            return resp;
        }
        catch(err){
            console.log(err);
            return err;
        }
    }

   async scheduleSession({
            title,date,time,duration,fee,expertId,sebiID
            }: {
            title: string,date: string,time: string,duration: number,fee: number,expertId: string
            ,sebiID: string
        }) {
        try {
            // Create the new session
            const resp = await this.databases.createDocument(
            conf.appwriteDatabaseId,
            conf.appwriteSessionsId,
            ID.unique(),
            {
                title,
                date,
                time,
                duration,
                fee,
                expertId
            }
            );
            console.log("Sebi id at time of creating session", sebiID);
            // Get the SEBI document
            const sebi = await this.getSebiById(sebiID) as { sessions: string[], sebiId: string };
            console.log("SEBI fetched while creating doc:", sebi);  
            // Create a new array with the pushed session ID
            console.log("Sebi Sessiosns before update:", sebi.sessions,
                "Sebi ID:", sebi.sebiId,
            );
            console.log("New session ID:", resp.$id);
            // Push the new session ID into the sessions array
            sebi.sessions = [ resp.$id,...(sebi.sessions || [])];

            console.log("Updated sessions array:", sebi.sessions);  
            // Update SEBI document
            const resp2 = await this.databases.updateDocument(
            conf.appwriteDatabaseId,
            conf.appwriteSebiId, // ← ensure this is the SEBI collection ID
            sebiID,
            {
                sessions: sebi.sessions
            }
            );

            console.log("SEBI updated with new session:", resp2);
            return resp2;
        } catch (err) {
            console.log(err);
            return err;
        }
    }


    async getSessionsBySebiId(sebiID: string){
        try{
            const data = await this.getSebiById(sebiID) as {
                sessions: string[]
            };
            console.log("Session By Sebi Id obtained",data);

            const user = await this.getUserbyId("68ef4409003b03f3ae94");
            console.log("User obtained",user);

            // If there are no sessions, return an empty array
            if (!data || !data.sessions || data.sessions.length === 0) {
                return [];
            }
            const sessionsList : SessionInterface[] = [];
            await Promise.all(
                data.sessions.map(sessionId => this.getSessionById(sessionId) as Promise<SessionInterface>)
            ).then(sessions => {
                console.log("Sessions obtained",sessions);
                sessionsList.push(...sessions);
            });
            // Ensure there is at least one document and it has a sessions property
            return sessionsList.length > 0 ? sessionsList : [];
        }
        catch(err){
            console.log(err);
            return err;
        }
    }

    async getSessionById(sessionID: string){
        try{
            const data = await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteSessionsId,
                sessionID
            );
            console.log(data);
            return data;
        }
        catch(err){
            console.log(err);
            return err;
        }
    }

    async addUserToSession({sessionId, userId} : {sessionId: string, userId: string}){
        try{
            const session = await this.getSessionById(sessionId) as {
                users: string[]
            };
            const resp = await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteSessionsId,
                sessionId,
                {
                    users: [...session.users, userId]
                }
            );
            console.log(resp);
            return resp;
        }
        catch(err){
            console.log(err);
            return err;
        }
    }

    async deleteSession(sessionId: string, sebiID: string){
        try{
            const resp = await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteSessionsId,                
                sessionId
            );
            // remove from sebi as well
            const sebi = await this.getSebiById(sebiID) as{
                sessions: string[]
            };
            if (sebi && sebi.sessions) {
                sebi.sessions = sebi.sessions.filter(id => id !== sessionId);
                await this.databases.updateDocument(
                    conf.appwriteDatabaseId,
                    conf.appwriteSebiId,
                    sebiID,
                    {
                        sessions: sebi.sessions
                    }
                );
            }

            console.log("Session deleted from both:");
            return resp;
        }
        catch(err){
            console.log(err);
            return err;
        }
    }
}

// ----------------------------------



const dbClient = new DBService();
export default dbClient;