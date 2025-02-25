import { DynamoDBClient,PutItemCommand } from "@aws-sdk/client-dynamodb";
import bcrypt from "bcryptjs";

const dynamoDBClient = new DynamoDBClient();
const { USER_TABLE } = process.env;

export const addRegisterdUser = async (item) => {

    const Sub = item?.userSub;
    const Email = item?.email;
    const Role = item?.role;

    const addUser = await dynamoDBClient.send(
        new PutItemCommand({
            TableName: USER_TABLE,
            Item: {
                userId: { S: Sub },
                email: { S: Email },
                role: { S: Role },
                createdAt: { S: new Date().toISOString() },
                confirmed: { BOOL : true }
            }
        })
    );
    return addUser;
}

export const addCreatedUser = async (item) => {

    const Sub = item?.createFaculty;
    const Email = item?.email;
    const Role = item?.role;
    const CreatedBy = item?.createdBy;

    const addUser = await dynamoDBClient.send(
        new PutItemCommand({
            TableName: USER_TABLE,
            Item: {
                userId: { S: Sub },
                email: { S: Email },
                role: { S: Role },
                createdBy: { S: CreatedBy },
                createdAt: { S: new Date().toISOString() },
            }
        })
    );
    return addUser;
}