const conf = {
    appUrl : "https://stocknova.co.in",
    // appUrl : "http://localhost:3000",
    // appUrl : "https://stockonova.com",
    appwriteUrl: String(process.env.NEXT_PUBLIC_APPWRITE_URL),
    appwriteProjectId: String(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID),
    appwriteDatabaseId: String(process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID),
    appwriteUserId: String(process.env.NEXT_PUBLIC_APPWRITE_USER_ID),
    appwriteRequestId : String(process.env.NEXT_PUBLIC_APPWRITE_REQUEST_ID),
    appwriteSebiId : String(process.env.NEXT_PUBLIC_APPWRITE_SEBI_ID),
    appwriteSessionsId : String(process.env.NEXT_PUBLIC_APPWRITE_SESSIONS_ID),
}

export default conf;
