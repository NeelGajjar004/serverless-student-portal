import { recordList } from "../../utils/dynamodb.js";
import { response } from "../../utils/response.js";
import { deleteCognitoUser } from "../../utils/cognito.js";
const { SUPER_ADMIN_GROUP, USER_TABLE } = process.env;


export const handler = async (event) => {
    
    const claims = event.requestContext?.authorizer?.claims;
    console.log("requested User Claims : ",claims);
    // const userGroup = (claims['cognito:groups'] || '').split(','); // user belongs to multiple groups
    const userGroup = claims['cognito:groups']; // user belongs to only one groups

    if(userGroup !== SUPER_ADMIN_GROUP){
        return response({
            statusCode: 401,
            isSuccess: false,
            message:'Error on Listing Users..!',
            error:"Unauthorized Access"
        });
    }
    
    try {
        
        const userlist = await recordList({tableName:USER_TABLE});


        return response({
            statusCode: 200,
            isSuccess: true,
            data: userlist,
            message:'User List Fetched Successfully...'
        });
        
    } catch (error) {
        console.error("[user-list.js]    ==========> ", error);
        return response({
            statusCode: 500,
            isSuccess: false,
            message:'Error on Listing User..!',
            error:error.name+" : "+error.message
        });   
    }
}