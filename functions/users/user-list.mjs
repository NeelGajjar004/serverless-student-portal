import { recordsList } from "../../utils/dynamodb.mjs";
import { generateResponse } from "../../utils/response.mjs";

const { SUPER_ADMIN_GROUP, USER_TABLE } = process.env;

export const handler = async (event) => {
    
    const claims = event.requestContext?.authorizer?.claims;
    const userGroup = claims['cognito:groups']; // user belongs to only one groups
    // const userGroups = (claims['cognito:groups'] || '').split(','); // user belongs to multiple groups

    if(userGroup !== SUPER_ADMIN_GROUP){

        return response({
            statusCode: 401,
            isSuccess: false,
            error:"Unauthorized Access"
        });

    }
    
    try {
        const userlist = await recordsList({ tableName:USER_TABLE });

        return generateResponse({
            statusCode: 200,
            isSuccess: true,
            data: userlist,
            message:'users list fetched successfully...'
        });
        
    } catch (error) {
        console.error("[user-list.mjs]    ==========> ", error);

        return generateResponse({
            statusCode: 500,
            isSuccess: false,
            message:'error on listing users..!',
            error:error.name+" : "+error.message
        });   
        
    }
}