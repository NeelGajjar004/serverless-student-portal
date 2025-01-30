import { createUser } from "../utils/dynamodb.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
const { USER_TABLE } = process.env;

export const handler = async (event,context) => {
    try {
        // console.log("create user function event body : ",event.body);
        const body = JSON.parse(event.body);

        const userData = await createUser(body,USER_TABLE);
        // console.log("\nType of userData :",typeof(userData));
        // return new apiResponse(201,true,userData,"User Created Successfully");
        return userData;


    } catch (error) {
        console.log("\n[create-user.js] \nissues on create-user Handler Function : ",error);
        return new apiError(500,"[create-user.js] \nSomethong went wrong with while creating user..! ",error);
    }
}