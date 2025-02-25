import { createFacultyUserBySuperAdminAndFacultyGroupUser } from "../../utils/cognito.js";
import { addCreatedUser } from "../../utils/dynamodb.js";
import { response } from "../../utils/response.js";

const { SUPER_ADMIN_GROUP, FACULTY_GROUP } = process.env;


export const handler = async (event,context) => {
    const claims = event.requestContext?.authorizer?.claims;
    console.log("claims : ",claims);
    // const userGroup = (claims['cognito:groups'] || '').split(',');
    const userGroup = claims['cognito:groups'];
    console.log("userGroup : ",userGroup);

    if(userGroup !== SUPER_ADMIN_GROUP && userGroup !== FACULTY_GROUP){
        return response({
            statusCode: 401,
            isSuccess: false,
            message:'Error on Creating Faculty User..!',
            error:"Unauthorized Access"
        });
    }

    const { email, password } = JSON.parse(event.body);

    try {
        // if ([email].some((field) => field?.trim() === "")) {
        //     const error = new Error("Email are required");
        //     error.code = "INVALID_INPUT";
        //     throw error;
        // }

        const createFaculty = await createFacultyUserBySuperAdminAndFacultyGroupUser({email:email,password:password});

        const createdBy = claims.email;

        const role = FACULTY_GROUP;

        const storeUserToDB = await addCreatedUser({createFaculty,email,role,createdBy});

        return response({
            statusCode: 200,
            isSuccess: true,
            data: storeUserToDB,
            message:'Faculty User Created Successfully...'
        });

        
    } catch (error) {
        console.error("[create-faculty.js]    ==========> ", error);
        return response({
            statusCode: 400,
            isSuccess: false,
            message:'Error on Creating Faculty User..!',
            error:error.message
        });
    }

}
