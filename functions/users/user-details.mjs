import { getRecord } from "../../utils/dynamodb.mjs";
import { generateResponse } from "../../utils/response.mjs";

const { SUPER_ADMIN_GROUP, FACULTY_GROUP, STUDENT_GROUP, USER_TABLE } = process.env;

export const handler = async (event) => {
    
    const claims = event.requestContext?.authorizer?.claims;
    const userGroup = claims['cognito:groups']; // user belongs to only one groups
    // const userGroups = (claims['cognito:groups'] || '').split(','); // user belongs to multiple groups

    if(![ SUPER_ADMIN_GROUP, FACULTY_GROUP, STUDENT_GROUP ].includes(userGroup)){
        
        return generateResponse({
            statusCode: 401,
            isSuccess: false,
            error:"Unauthorized Access"
        });
    
    }

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
}
