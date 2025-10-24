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

    async addRequest({userId ,name, email, sebiId, experience, specialization, bio, phone} : {userId: string, name: string, email: string, sebiId: string, experience: number, specialization: string, bio: string, phone: string}){
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
                phone : phone
            });

            await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteUserId,
                userId,
                {
                    phone : phone
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
                intro : JSON.stringify({
                    $id : "",
                    title : "",
                    time : "",
                    date : ""
                }),
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

            const res = await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteSebiId,
                expertId                
            );

            await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteSebiId,
                expertId,
                {
                    introUsersToSave : [...(res.introUsersToSave || []), id]
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
            title,date,time,duration,fee,expertId,sebiID, tag
            }: {
            title: string,date: string,time: string,duration?: number,fee: number,expertId: string
            ,sebiID: string, tag?: string
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
                expertId,
                tag
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
            await this.databases.updateDocument(
            conf.appwriteDatabaseId,
            conf.appwriteSebiId, // ← ensure this is the SEBI collection ID
            sebiID,
            {
                sessions: sebi.sessions
            }
            );

            
            return resp;
        } catch (err) {
            console.log(err);
            return err;
        }
    }

    async getIntroUserToSave(expertId: string){ 
        try{
            const resp = await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteSebiId,
                expertId
            );
            return resp.introUsersToSave;
        }
        catch(err){
            console.log(err);
            return err;
        }
    }

    async addIntroUserToSave(expertId: string, userId: string){ 
        try{
            const sebi = await this.getSebiById(expertId) as {
                introUsersToSave : string[]
            };
            sebi.introUsersToSave = [...sebi.introUsersToSave, userId];
            const resp = await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteSebiId,
                expertId,
                {
                    introUsersToSave : sebi.introUsersToSave
                }
            );
            return resp;
        }
        catch(err){
            console.log(err);
            return err;
        }
    }

    async getSessionsBySebiId(sebiID: string){
        try{
            const data = await this.getSebiById(sebiID) as {
                sessions: string[]
            };

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

    async getPastSessionsBySebiId(sebiID: string){
        try{
            const data = await this.getSebiById(sebiID) as {
                pastSessions: string[]
            };

            // If there are no sessions, return an empty array
            if (!data || !data.pastSessions || data.pastSessions.length === 0) {
                return [];
            }
            const sessionsList : SessionInterface[] = [];
            await Promise.all(
                data.pastSessions.map(sessionId => this.getSessionById(sessionId) as Promise<SessionInterface>)
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

            console.log("Current session :", session);

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

    async updateEarnings(sebiID: string, amount: number){
        try{
            const sebi = await this.getSebiById(sebiID) as {
                earnings: number
            };
            const newEarnings = (sebi.earnings || 0) + amount;
            await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteSebiId,
                sebiID,
                {
                    earnings: newEarnings
                }
            );
        }
        catch(err){
            console.log(err);
            return err;
        }
    }

    async getEarnings(sebiID: string){
        try{
            const sebi = await this.getSebiById(sebiID) as {
                earnings: number
            };
            return sebi.earnings || 0;
        }
        catch(err){
            console.log(err);
            return err;
        }
    }

    async markSessionAsComplete(sessionId: string, sebiID: string){
        try{
            const sebi = await this.getSebiById(sebiID) as{
                sessions: string[],
                pastSessions: string[]
            };
            sebi.sessions = sebi.sessions.filter(id => id !== sessionId);
            sebi.pastSessions.push(sessionId);
            await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteSebiId,
                sebiID,
                {
                    sessions: sebi.sessions,
                    pastSessions: sebi.pastSessions
                }
            );

            const data = await this.getSessionById(sessionId);
            await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteSessionsId,
                sessionId,
                {
                    status: 'completed'
                }
            );
            return data;
        }
        catch(err){
            console.log(err);
            return err;
        }
    }

    async getAllSessions(){
        try{
            const resp = await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteSessionsId,
                [
                    Query.orderDesc('$createdAt')
                ]
            );
            console.log(resp.documents);
            // Return the array of session documents (each item is a session document)
            return resp.documents;
        } catch(err) {
            console.log(err);
            return err;
        }
    }

    async endIntroSession(sebiId : string){
        await this.databases.updateDocument(
            conf.appwriteDatabaseId,
            conf.appwriteSebiId,
            sebiId,
            {
                intro: JSON.stringify({
                    title : "",
                    time : "",
                    date : ""
                })
            }
        );
    }

    async addIntroSession(sebiId : string, intro : string){
        const res = await this.databases.updateDocument(
            conf.appwriteDatabaseId,
            conf.appwriteSebiId,
            sebiId,
            {
                intro: intro
            }
        );  

        console.log("Intro session added:", res);
        return res;
    }

}


const dbClient = new DBService();
export default dbClient;