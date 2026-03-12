import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
export async function POST(request: Request) {
    try{
        const data = await request.formData();
        const file = data.get("file") as File;
          if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    console.log("Uploading image to server...")
    // Convert file -> Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    interface CloudinaryUploadResponse {
      secure_url: string;
    //   [key: string]: any;
    }
    const uploadResponse = await new Promise<CloudinaryUploadResponse>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "nextjs_uploads" }, (error, result) => {
          if (error) reject(error);
          else resolve(result as CloudinaryUploadResponse);
        })
        .end(buffer);
    });
    console.log(uploadResponse)

        return NextResponse.json({message : "Image uploaded successfully", image : uploadResponse!.secure_url},{status : 200})
    }
    catch(e){
        console.log("Error in uploading image",e)
        return NextResponse.json({message : "Failed to upload image", error : e},{status : 500})
    }
}