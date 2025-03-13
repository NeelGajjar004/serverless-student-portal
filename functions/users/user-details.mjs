import middy from "@middy/core";
import { getRecord } from "../../utils/dynamodb.mjs";
import { generateResponse } from "../../utils/response.mjs";
import { authorizeByGroup } from "../../middleware/before-middleware.mjs";

const { SUPER_ADMIN_GROUP, FACULTY_GROUP, STUDENT_GROUP, USER_TABLE } = process.env;

const handler = middy(async (event) => {
    
    const claims = event.requestContext?.authorizer?.claims;
    const userId = claims['sub'];
    
    try {
        const key = { userId: userId };

        const userDetails = await getRecord({ tableName: USER_TABLE, key: key });

        return generateResponse({
            statusCode: 200,
            isSuccess: true,
            data: userDetails.Item,
            message:'user details fetched successfully...'
        });
        
    } catch (error) {
        console.error("[user-details.mjs]    ==========> ", error);

        return generateResponse({
            statusCode: 500,
            isSuccess: false,
            message:'error on getting user details..!',
            error:error.name+" : "+error.message
        }); 

    }
});

handler.use({
    before: authorizeByGroup([ SUPER_ADMIN_GROUP, FACULTY_GROUP, STUDENT_GROUP ])
});

export { handler }
