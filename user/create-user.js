import { createUser } from "../utils/dynamodb.js";
import { response } from "../utils/response.js"; 
const { USER_TABLE } = process.env;

export const handler = async (event,context) => {
    try {
        const body = JSON.parse(event?.body);
        const userData = await createUser(body,USER_TABLE);
        if(userData){
            return response(201,true,userData,"User Created Successfully");
        }
    } catch (error) {
        console.error("==========> ",error);
        return response(400,false,null,error.message,error,error.code);   
    }
}
