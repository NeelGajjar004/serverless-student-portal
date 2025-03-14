import middy from "@middy/core";
import { deleteCognitoUser } from "../../utils/cognito.mjs";
import { deleteRecord, getRecord } from "../../utils/dynamodb.mjs";
import { generateResponse } from "../../utils/response.mjs";
import { authorizeByGroup } from "../../middlewares/authorizer-middleware.mjs";

const { SUPER_ADMIN_GROUP, USER_TABLE } = process.env;

const handler = middy(async (event) => {
    
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
});

handler.use({
    before: authorizeByGroup([ SUPER_ADMIN_GROUP ])
});

export { handler }