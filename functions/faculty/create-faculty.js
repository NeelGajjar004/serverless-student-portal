import { createCognitoUser } from "../../utils/cognito.js";
import { insertRecord } from "../../utils/dynamodb.js";
import { response } from "../../utils/response.js";

const { SUPER_ADMIN_GROUP, FACULTY_GROUP, USER_TABLE } = process.env;


export const handler = async (event) => {
    const claims = event.requestContext?.authorizer?.claims;
    console.log("requested User Claims : ",claims);

    // const userGroup = (claims['cognito:groups'] || '').split(','); // user belongs to multiple groups
    const userGroup = claims['cognito:groups']; // user belongs to only one groups
    // console.log("userGroup : ",userGroup);

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

        const createFaculty = await createCognitoUser({email:email,password:password,isStudent:false});

        const userSub = createFaculty.UserAttributes.find(attr => attr.Name === "sub")?.Value;

        const createdBy = claims?.email;

        const role = FACULTY_GROUP;

        const item = {
            userId: userSub,
            email: email,
            role: role,
            createdBy: createdBy,
            createdAt: new Date().toISOString(),
            confirmed: true
        };

        const storeUserToDB = await insertRecord(item,USER_TABLE);

        // const storeUserToDB = await addFacultyUser({userSub,email,role,createdBy});

        return response({
            statusCode: 200,
            isSuccess: true,
            data: storeUserToDB,
            message:'Faculty User Created Successfully...'
        });

        
    } catch (error) {
        console.error("[create-faculty.js]    ==========> ", error);

        // Handle InvalidPasswordException
        if (error.name === "InvalidPasswordException") {
            return response({
                statusCode: 400,
                isSuccess: false,
                message: 'Password does not meet the requirements',
                error: "InvalidPasswordException : Password must be at least 8 characters long. ==> Password Contains at least one uppercase, lowercase, numbers, and special characters."
            });
        }

        return response({
            statusCode: 400,
            isSuccess: false,
            message:'Error on Creating Faculty User..!',
            error:error.message
        });
    }

}
