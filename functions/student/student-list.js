import { getUserListByRoles } from "../../utils/dynamodb.js";
import { response } from "../../utils/response.js";
const { STUDENT_GROUP, FACULTY_GROUP, USER_TABLE } = process.env;


export const handler = async (event) => {
    
    const claims = event.requestContext?.authorizer?.claims;
    console.log("requested User Claims : ",claims);
    // const userGroup = (claims['cognito:groups'] || '').split(','); // user belongs to multiple groups
    const userGroup = claims['cognito:groups']; // user belongs to only one groups

    if(userGroup !== FACULTY_GROUP){
        return response({
            statusCode: 401,
            isSuccess: false,
            message:'Error on Listing Students..!',
            error:"Unauthorized Access"
        });
    }
    
    try {
        
        const studentList = await getUserListByRoles({role:STUDENT_GROUP,tableName:USER_TABLE});

        return response({
            statusCode: 200,
            isSuccess: true,
            data: studentList,
            message:'Students List Fetched Successfully...'
        });
        
    } catch (error) {
        console.error("[student-list.js]    ==========> ", error);
        return response({
            statusCode: 500,
            isSuccess: false,
            message:'Error on Listing Students..!',
            error:error.name+" : "+error.message
        });   
    }
}