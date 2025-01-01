import s3Client from "@/cloud/aws";
import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { Request } from "express";
import { File } from "formidable";
import fs from "fs";
import { generateS3ClientPublicUrl } from "./helper";



export const updateAvatarToAws = async (
  file: File,
  uniqueFileName: string,
  avatarId?: string
) => {
  const bucketName = "ebook-public-datas";
  if (avatarId) {
    const deleteCommand = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: avatarId,
    });
    await s3Client.send(deleteCommand);
  }

  const putCommand = new PutObjectCommand({
    Bucket: bucketName,
    Key: uniqueFileName,
    Body: fs.readFileSync(file.filepath),
  });
  await s3Client.send(putCommand);

  return {
    id: uniqueFileName,
    url: generateS3ClientPublicUrl('ebook-public-datas',uniqueFileName)
  };
};