import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/apiGateway";
import { formatJSONResponse } from "@libs/apiGateway";
import { middyfy } from "@libs/lambda";
import * as AWS from "aws-sdk";
// import * as multipart from "aws-lambda-multipart-parser";

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

  const data = await S3.deleteObject({Key:"1soskv4a2ig_Screenshot (3).png", Bucket:"local-bucket"}).promise()
  console.log(data);

  return formatJSONResponse({ data, event });
};

export const main = middyfy(hello);
