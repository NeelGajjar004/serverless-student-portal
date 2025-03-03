import { getRecord } from "../../utils/dynamodb.js";
import { response } from "../../utils/response.js";
const { SUPER_ADMIN_GROUP, FACULTY_GROUP, STUDENT_GROUP, USER_TABLE } = process.env;


export const handler = async (event) => {
    
    const claims = event.requestContext?.authorizer?.claims;
    console.log("requested User Claims : ",claims);
    // const userGroup = (claims['cognito:groups'] || '').split(','); // user belongs to multiple groups
    const userGroup = claims['cognito:groups']; // user belongs to only one groups

    if(userGroup !== STUDENT_GROUP && userGroup !== SUPER_ADMIN_GROUP && userGroup !== FACULTY_GROUP){
        return response({
            statusCode: 401,
            isSuccess: false,
            message:'Error on Getting User Details..!',
            error:"Unauthorized Access"
        });
    }

    const userId = claims['sub'];
    console.log("user Id : ",userId);
    
    try {
        const Key = {
            userId: userId
        }

        const userDetails = await getRecord({
            tableName: USER_TABLE,
            key: Key
        });

        return response({
            statusCode: 200,
            isSuccess: true,
            data: userDetails.Item,
            message:'User Details Fetched Successfully...'
        });
        
    } catch (error) {
        console.error("[User-Details.js]    ==========> ", error);
        return response({
            statusCode: 500,
            isSuccess: false,
            message:'Error on Getting User Details..!',
            error:error.name+" : "+error.message
        });   
    }
}
