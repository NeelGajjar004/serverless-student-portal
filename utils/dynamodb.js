import { DynamoDBClient,PutItemCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, UpdateCommand, GetCommand, DeleteCommand, ScanCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
const dynamoDBClient = new DynamoDBClient();
const docClient = DynamoDBDocumentClient.from(dynamoDBClient);
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

export const insertRecord = async (item,tableName) => {
    return await docClient.send(
        new PutCommand({
            TableName: tableName,
            Item: item
        })
    );
}

export const updateRecord = async ({key,updateExp,expAttName,expAttVal,tableName}) => {
    return await docClient.send(
        new UpdateCommand({
            TableName: tableName,
            Key: key,
            UpdateExpression: updateExp,
            // ExpressionAttributeNames: expAttName,
            ExpressionAttributeValues:expAttVal,
            ReturnValues: 'ALL_NEW'
        })
    );
}

export const getRecord = async ({ key, tableName }) => {
    return await docClient.send(
        new GetCommand({
            TableName: tableName,
            Key: key
        })
    );
}

export const deleteRecord = async ({key, tableName}) => {
    return await docClient.send(
        new DeleteCommand({
            TableName: tableName,
            Key: key
        })
    );
}

export const recordList = async ({tableName}) => {
    const userList = await docClient.send(
        new ScanCommand({
            TableName:tableName
        })
    );

    const users = userList.Items.map(item => ({
        userId: item?.userId,
        email: item?.email,
        role: item?.role,
        details: item?.details,
        department: item?.department,
        classNo: item?.classNo,
        createdBy: item?.createdBy,
        updatedBy: item?.updatedBy,
        createdAt: item?.createdAt,
        confirmed: item?.confirmed
    }));

    return users;
}

export const getUserListByRoles = async ({role,tableName}) => {
    const userList = await docClient.send(
        new QueryCommand({
            TableName:tableName,
            IndexName: "groupIndex",
            KeyConditionExpression: "#role = :role",
            ExpressionAttributeNames:{
                "#role":"role"
            },
            ExpressionAttributeValues:{
                ":role": role
            }
        })
    );

    const users = userList.Items.map(item => ({
        userId: item?.userId,
        email: item?.email,
        role: item?.role,
        details: item?.details,
        department: item?.department,
        classNo: item?.classNo,
        createdBy: item?.createdBy,
        updatedBy: item?.updatedBy,
        createdAt: item?.createdAt,
        confirmed: item?.confirmed
    }));

    return users;
}