import { deleteRecord, getRecord } from "../../utils/dynamodb.js";
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
            message:'Error on Deleting User..!',
            error:"Unauthorized Access"
        });
    }

    const { userId } = event.pathParameters;
    console.log("user Id : ",userId);

    
    try {
        const Key = { userId: userId };

        const existingUser = await getRecord({
            tableName: USER_TABLE,
            key: Key
        });

        if (!existingUser || !existingUser.Item) {
            const error = new Error("User Not Found..!");
            error.name = "USER_NOT_FOUND_EXCEPTION";
            throw error;
        }
        const userName = existingUser.Item.email;

        const removeUserfromCognito = await deleteCognitoUser({userName:userName});
        
        const deletedUser = await deleteRecord({key:Key,tableName:USER_TABLE});

        return response({
            statusCode: 200,
            isSuccess: true,
            data: deletedUser,
            message:'User Deleted Successfully...'
        });
        
    } catch (error) {
        console.error("[delete-user.js]    ==========> ", error);
        return response({
            statusCode: 500,
            isSuccess: false,
            message:'Error on Deleting User..!',
            error:error.name+" : "+error.message
        });   
    }
}