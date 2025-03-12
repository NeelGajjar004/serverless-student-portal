import { DynamoDBClient,PutItemCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, UpdateCommand, GetCommand, DeleteCommand, ScanCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";

const { USER_TABLE } = process.env;
const dynamoDBClient = new DynamoDBClient();
const docClient = DynamoDBDocumentClient.from(dynamoDBClient);

export const addRegisterdUserToDB = async (item) => {

    const sub = item?.userSub;
    const email = item?.email;
    const role = item?.role;

    const addUser = await dynamoDBClient.send(
        new PutItemCommand({
            TableName: USER_TABLE,
            Item: {
                userId: { S: sub },
                email: { S: email },
                role: { S: role },
                createdAt: { S: new Date().toISOString() },
                confirmed: { BOOL : true }
            }
        })
    );

    return addUser;
}

export const insertRecord = async ({ tableName, item }) => {
    
    return await docClient.send(
        new PutCommand({
            TableName: tableName,
            Item: item
        })
    );

}

export const updateRecord = async ({ tableName, key, updateExp, expAttVal }) => {
    
    return await docClient.send(
        new UpdateCommand({
            TableName: tableName,
            Key: key,
            UpdateExpression: updateExp,
            ExpressionAttributeValues:expAttVal,
            ReturnValues: 'ALL_NEW'
        })
    );

}

export const getRecord = async ({ tableName, key }) => {
    
    return await docClient.send(
        new GetCommand({
            TableName: tableName,
            Key: key
        })
    );

}

export const deleteRecord = async ({ tableName, key }) => {
    
    return await docClient.send(
        new DeleteCommand({
            TableName: tableName,
            Key: key
        })
    );

}

export const recordsList = async ({ tableName }) => {
    
    const usersList = await docClient.send(
        new ScanCommand({
            TableName:tableName
        })
    );

    const users = usersList.Items.map(item => ({
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

export const getUsersListByRoles = async ({ tableName, role }) => {

    const usersList = await docClient.send(
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

    const users = usersList.Items.map(item => ({
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