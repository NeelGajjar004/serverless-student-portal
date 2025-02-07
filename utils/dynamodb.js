import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, PutCommand, QueryCommand, DeleteCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

const DynamoDB = DynamoDBDocumentClient.from(new DynamoDBClient());
const validRoles = ["superAdmin","faculty"];


export const createUser = async (item, tableName) => {
    const email = item.email;
    const userName = item.userName;
    const password = item.password;
    const role = item.role;

    if([userName,email,password,role].some((field) => field?.trim() === "")){
        const error = new Error("Error : All fields are required: email, userName, password, role");
        error.code = "INVALID_INPUT";
        throw error;
    }
    if(!validRoles.includes(role)){
        const error = new Error(`Error : Invalid role. => Allowed roles: ${validRoles.join(", ")}.`);
        error.code = "INVALID_ROLE";
        throw error;
    }

    //create user
    const params = {
        TableName: tableName,
        Item:{
            _id: uuidv4(),
            email: email,
            userName: userName,
            role: role,
            password: bcrypt.hashSync(password,8),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        ReturnConsumedCapacity: "TOTAL", // INDEX/NONE
        ConsistentRead: true
    };
    
    const createCommand = new PutCommand(params);
    const metaData = await DynamoDB.send(createCommand);

    if(metaData){
        return {userName, email, role, metaData}
    }
}

export const loginUser = async (item, tableName) => {
    const email = item.email;
    const password = item.password;

    // fields validation 
    if([email, password].some((field) => field?.trim() === "")){
        const error = new Error("Error : All fields are required: email, userName, password, role");
        error.code = "INVALID_INPUT";
        throw error;
        // throw new apiError(400,"email and password fields are required");
    }

    const params = {
        TableName: tableName,
        Key:{
            email: email
        },
    };
}