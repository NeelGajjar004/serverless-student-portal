import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, PutCommand, QueryCommand, DeleteCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { ApiError } from "./ApiError.js";

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
    
        // fields validation 
        if([userName,email,password,role].some((field) => field?.trim() === "")){
            throw new ApiError(400,"All fields are required");
        }
        //Roles validation
        if(!validRoles.includes(role)){
            throw new ApiError(400,` Invalid Role : ${role} ==> Valid Roles are ${validRoles.join(",")} `);
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
        };
        
        const createCommand = new PutCommand(params);
        // console.log("createCommand : ",createCommand);
        return await DynamoDB.send(createCommand);


    } catch (error) {
        console.log("\n Error on createUser method [dynamodb.js] : ",error);
        throw new ApiError(500,"Somethong went wrong with while creating user..! [dynamodb.js]",error);
    }
}

// const loginUser = async (item, tableName) => {
//     try {
//         const email = item.email;
//         const password = item.password;

//         // fields validation 
//         if([email, password].some((field) => field?.trim() === "")){
//             throw new ApiError(400,"email and password fields are required");
//         }

//         const params = {
//             TableName: tableName,
//             Key:{
//                 email: email
//             },
//         };


//     } catch (error) {
//         console.log("\n Error on createUser method [dynamodb.js] : ",error);
//         throw new ApiError(500,"Somethong went wrong with while creating user..! [dynamodb.js]",error);
//     }
// }

// module.exports = {
//     createUser
// }







