import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/apiGateway";
import { formatJSONResponse } from "@libs/apiGateway";
import { middyfy } from "@libs/lambda";
import * as AWS from "aws-sdk";
import schema from "./schema";

const hello: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  AWS.config.update({ region: "eu-west-2" });
  const S3 = new AWS.S3({
    s3ForcePathStyle: true,
    accessKeyId: "S3RVER",
    secretAccessKey: "S3RVER",
    endpoint: new AWS.Endpoint("http://localhost:4569"),
  });
  // S3.getObject

  const textract = new AWS.Textract();

  const data = await S3.getObject({
    Key: "l098i94i5li_Screenshot (3).png",
    Bucket: "local-bucket",
  }).promise();
  const data1 = {
    Document: {
      Bytes: data.Body,
    },
    FeatureTypes:['TABLES']
  };
  const anal = await textract.analyzeDocument(data1).promise();
  console.log(anal);
  
  

  return formatJSONResponse({ data, event });
};

export const main = middyfy(hello);
