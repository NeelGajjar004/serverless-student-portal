import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { createUser } from "../utils/dynamodb.js";
const { USER_TABLE } = process.env;

export const handler = async (event,context) => {
    try {
        console.log(event.body);
        const body = JSON.parse(event.body);

        const userData = await createUser(body,USER_TABLE);
        console.log(userData);

        return new ApiResponse(201,JSON.stringify(userData),"User Created Successfully");


    } catch (error) {
        console.log("\nError on create-user Handler Function : ",error);
        throw new ApiError(500,"Somethong went wrong with while creating user..! [dynamodb.js]",error);
    }
}