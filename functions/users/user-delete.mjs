import { deleteCognitoUser } from "../../utils/cognito.mjs";
import { deleteRecord, getRecord } from "../../utils/dynamodb.mjs";
import { generateResponse } from "../../utils/response.mjs";

const { SUPER_ADMIN_GROUP, USER_TABLE } = process.env;

export const handler = async (event) => {
    
    const claims = event.requestContext?.authorizer?.claims;
    const userGroup = claims['cognito:groups']; // user belongs to only one groups
    // const userGroups = (claims['cognito:groups'] || '').split(','); // user belongs to multiple groups

    if(userGroup !== SUPER_ADMIN_GROUP){

        return generateResponse({
            statusCode: 401,
            isSuccess: false,
            error:"Unauthorized Access"
        });

    }

    const { userId } = event.pathParameters;
    
    try {
        const key = { userId: userId };
        const existingUser = await getRecord({ tableName: USER_TABLE, key: key });

        if (!existingUser || !existingUser.Item) {
            const error = new Error("User Not Found..!");
            error.name = "USER_NOT_FOUND_EXCEPTION";
            throw error;
        }

        const userName = existingUser.Item.email;
        const removeUserfromCognito = await deleteCognitoUser({ userName:userName });
        const deletedUser = await deleteRecord({ tableName: USER_TABLE, key: key });

        return generateResponse({
            statusCode: 200,
            isSuccess: true,
            data: deletedUser,
            message:'user deleted successfully...'
        });
        
    } catch (error) {
        console.error("[delete-user.mjs]    ==========> ", error);

        return generateResponse({
            statusCode: 500,
            isSuccess: false,
            message:'error on deleting user..!',
            error:error.name+" : "+error.message
        }); 

    }
}