import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/apiGateway";
import { formatJSONResponse } from "@libs/apiGateway";
import { middyfy } from "@libs/lambda";
import * as AWS from "aws-sdk";
import * as multipart from "aws-lambda-multipart-parser";

import schema from "./schema";

const hello: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  const S3 = new AWS.S3({
    s3ForcePathStyle: true,
    accessKeyId: "S3RVER", // This specific key is required when working offline
    secretAccessKey: "S3RVER",
    endpoint: new AWS.Endpoint("http://localhost:4569"),
  });

  // S3.uploadPart
  const form = multipart.parse(event, false);
  const s3_response = await upload_s3(form, S3);

  return formatJSONResponse({ s3_response, event });
};

const upload_s3 = async (form, S3) => {
  console.log(form.file.filename);
  const uniqueId = Math.random().toString(36).substring(2);
  const key = `${uniqueId}_${form.file.filename}`;

  const request = {
    Bucket: "local-bucket",
    Key: key,
    Body: Buffer.from(form.file.content, "ascii"),
    ContentType: form.file.contentType,
  };

  console.log(request);

  try {
    const data = await S3.putObject(request).promise();
    return data;
  } catch (e) {
    console.log("Error uploading to S3: ", e);
    return e;
  }
};

export const main = middyfy(hello);
