import type { AWS } from "@serverless/typescript";

import createFile from "@functions/createFile";
import getFile from "@functions/getFile";
import deleteFile from "@functions/deleteFile";

const serverlessConfiguration: AWS = {
  service: "serverless-s3-local-example",
  frameworkVersion: "2",
  plugins: ["serverless-esbuild", "serverless-s3-local", "serverless-offline"],
  provider: {
    name: "aws",
    runtime: "nodejs14.x",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
    },
    lambdaHashingVersion: "20201221",
  },
  functions: { createFile, getFile, deleteFile },
  package: { individually: true },
  custom: {
    serverlessOfflineS3: {
      endpoint: "http://localhost:9000",
      region: "eu-west-1",
      accessKey: "minioadmin",
      secretKey: "minioadmin",
    },

    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ["aws-sdk"],
      target: "node14",
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 10,
    },
  },
  resources: {
    Resources: {
      NewResource: {
        Type: "AWS::S3::Bucket",
        Properties: {
          BucketName: "local-bucket",
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
