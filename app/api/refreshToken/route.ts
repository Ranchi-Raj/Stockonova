import {NextResponse} from "next/server";
// import DBService from "@/appwrite/db";

export async function POST(req: Request){
    const {refreshToken} = await req.json();

    if(!refreshToken){
        return NextResponse.json({error: "Missing refresh token"}, {status: 400});
    }   

    // await DBService.updateRefreshToken(refreshToken);

    return NextResponse.json({message: "Refresh token updated successfully"}, {status: 200});
}