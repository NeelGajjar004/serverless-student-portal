import { getUsersListByRoles } from "../../utils/dynamodb.mjs";
import { generateResponse } from "../../utils/response.mjs";

const { STUDENT_GROUP, FACULTY_GROUP, USER_TABLE } = process.env;

export const handler = async (event) => {
    
    const claims = event.requestContext?.authorizer?.claims;
    const userGroup = claims['cognito:groups']; // user belongs to only one groups
    // const userGroups = (claims['cognito:groups'] || '').split(','); // user belongs to multiple groups

    if(userGroup !== FACULTY_GROUP){

        return generateResponse({
            statusCode: 401,
            isSuccess: false,
            error:"Unauthorized Access"
        });

    }
    
    try {
        const studentList = await getUsersListByRoles({ tableName:USER_TABLE, role:STUDENT_GROUP });

        return generateResponse({
            statusCode: 200,
            isSuccess: true,
            data: studentList,
            message:'students list fetched successfully...'
        });
        
    } catch (error) {
        console.error("[student-list.mjs]    ==========> ", error);

        return generateResponse({
            statusCode: 500,
            isSuccess: false,
            message:'error on listing students..!',
            error:error.name+" : "+error.message
        });   
        
    }
}