import middy from "@middy/core";
import { createCognitoUser } from "../../utils/cognito.mjs";
import { insertRecord } from "../../utils/dynamodb.mjs";
import { generateResponse } from "../../utils/response.mjs";
import { authorizeByGroup } from "../../middlewares/authorizer-middleware.mjs";

const { SUPER_ADMIN_GROUP, FACULTY_GROUP, USER_TABLE } = process.env;

const handler = middy(async (event) => {

    const claims = event.requestContext?.authorizer?.claims;
    const { email, password } = JSON.parse(event.body);

    try {
        const createFaculty = await createCognitoUser({ email:email, password:password, isStudent:false });
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

        const storeUserToDB = await insertRecord({ tableName:USER_TABLE, item:item });

        return generateResponse({
            statusCode: 200,
            isSuccess: true,
            data: storeUserToDB,
            message:'faculty created successfully...'
        });
        
    } catch (error) {
        console.error("[create-faculty.mjs]    ==========> ", error);

        let message = 'error on creating faculty..!';
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
});

handler.use({
    before: authorizeByGroup([ SUPER_ADMIN_GROUP, FACULTY_GROUP ])
});

export { handler }