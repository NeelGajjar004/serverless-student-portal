import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, PutCommand, QueryCommand, DeleteCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { apiError } from "./apiError.js";
import { apiResponse } from "./apiResponse.js";

// const client = new DynamoDBClient();
// const DynamoDB = DynamoDBDocumentClient.from(client);
const DynamoDB = DynamoDBDocumentClient.from(new DynamoDBClient());
const validRoles = ["superAdmin","faculty"];


export const createUser = async (item, tableName) => {
    
    try {
        const email = item.email;
        const userName = item.userName;
        const password = item.password;
        const role = item.role;
    
        // try {
            // fields validation 
            if([userName,email,password,role].some((field) => field?.trim() === "")){
                return new apiError(400,"All fields are required: email, userName, password, role");
                // return "All fields[userName, email, password, role] are required...!";            
            }
            //Roles validation
            if(!validRoles.includes(role)){
                return new apiError(400,`Invalid role. Allowed roles: ${validRoles.join(", ")}`);
                // return "Invalid Role : "+role+" ==> Valid Roles are "+validRoles.join(", ");
            }
        // } catch (error) {
            // console.log("Validation Error : ",error);
        // }

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

        return new apiResponse(201,true,{userName, email, role, metaData},"User Created Successfully")
        // return {userName, email, role, metaData};


    } catch (error) {
        console.log("\n[dynamodb.js] issues on createUser method  : ",error);
        // throw new apiError(500,"Somethong went wrong with while creating user..! [dynamodb.js]",error);
        throw new apiError(500,"[dynamodb.js] Somethong went wrong with while creating user..!",error);
    }
}

export const loginUser = async (item, tableName) => {
    try {
        const email = item.email;
        const password = item.password;

        // fields validation 
        if([email, password].some((field) => field?.trim() === "")){
            throw new apiError(400,"email and password fields are required");
        }

        const params = {
            TableName: tableName,
            Key:{
                email: email
            },
        };


    } catch (error) {
        console.log("\n Error on createUser method [dynamodb.js] : ",error);
        throw new apiError(500,"Somethong went wrong with while creating user..! [dynamodb.js]",error);
    }
}

// module.exports = {
//     createUser
// }







