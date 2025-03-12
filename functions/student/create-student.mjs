import { createCognitoUser } from "../../utils/cognito.mjs";
import { insertRecord } from "../../utils/dynamodb.mjs";
import { generateResponse } from "../../utils/response.mjs";

const { SUPER_ADMIN_GROUP, FACULTY_GROUP, STUDENT_GROUP, USER_TABLE } = process.env;

export const handler = async (event) => {

    const claims = event.requestContext?.authorizer?.claims;
    const userGroup = claims['cognito:groups']; // user belongs to only one groups
    // const userGroups = (claims['cognito:groups'] || '').split(','); // user belongs to multiple groups

    if(![SUPER_ADMIN_GROUP,FACULTY_GROUP].includes(userGroup)){

        return generateResponse({
            statusCode: 401,
            isSuccess: false,
            error:"Unauthorized Access"
        });
        
    }

    const { email, password, details } = JSON.parse(event.body);

    try {
        // if ([email].some((field) => field?.trim() === "")) {
        //     const error = new Error("Email is required");
        //     error.name = "INVALID_INPUT";
        //     throw error;
        // }
        
        const createFaculty = await createCognitoUser({ email:email, password:password, isStudent:true });
        const userSub = createFaculty.UserAttributes.find(attr => attr.Name === "sub")?.Value;
        const createdBy = claims?.email;
        const role = STUDENT_GROUP;

        const item = {
            userId: userSub,
            email: email,
            role: role,
            details:details,
            createdBy: createdBy,
            createdAt : new Date().toISOString(),
            confirmed: true
        };

        const storeUserToDB = await insertRecord({ tableName:USER_TABLE, item:item });

        return generateResponse({
            statusCode: 200,
            isSuccess: true,
            data: storeUserToDB,
            message:'student created successfully...'
        });
        
    } catch (error) {
        console.error("[create-student.mjs]    ==========> ", error);
        
        let message = 'error on creating student..!';
        let err = error.message;

        // Handle InvalidPasswordException
        if (error.name === "InvalidPasswordException") {
            message = 'Password does not meet the requirements';
            err = "InvalidPasswordException : Password must be at least 8 characters long. ==> Password Contains at least one uppercase, lowercase, numbers, and special characters.";
        }

        return generateResponse({
            statusCode: 400,
            isSuccess: false,
            message: message,
            error: err
        });

    }
}
