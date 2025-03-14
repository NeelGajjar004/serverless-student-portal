import middy from "@middy/core";
import { getUsersListByRoles } from "../../utils/dynamodb.mjs";
import { generateResponse } from "../../utils/response.mjs";
import { authorizeByGroup } from "../../middlewares/authorizer-middleware.mjs";

const { STUDENT_GROUP, FACULTY_GROUP, USER_TABLE } = process.env;

const handler = middy(async (event) => {
    
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
});

handler.use({
    before: authorizeByGroup([ FACULTY_GROUP ])
});

export { handler }