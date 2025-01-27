import { createUser } from "../utils/dynamodb.js";
import { ApiError } from "../utils/ApiError.js";
import { apiResponse } from "../utils/apiResponse.js";
const { USER_TABLE } = process.env;

export const handler = async (event,context) => {
    try {
        console.log(event.body);
        const body = JSON.parse(event.body);

        const userData = await createUser(body,USER_TABLE);
        console.log("User Data : ",JSON.stringify(userData));
        if(typeof(userData) !== Object){
            return new apiResponse(400,false,userData,"Something Went Wrong");
        }
        console.log(typeof(userData));
        return new apiResponse(201,true,userData,"User Created Successfully");


    } catch (error) {
        console.log("\nError on create-user Handler Function : ",error);
        throw new ApiError(500,"Somethong went wrong with while creating user..! [create-user.js]");
        // throw new ApiError(500,"Somethong went wrong with while creating user..! [create-user.js]",error);
    }
}