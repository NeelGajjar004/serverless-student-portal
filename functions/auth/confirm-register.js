import { verifyRegister, assignGroup,getUser } from "../../utils/cognito.js";
import { addRegisterdUser } from "../../utils/dynamodb.js";
import { response } from "../../utils/response.js";

export const handler = async (event, context) => {
    // console.log("Event Body : ", event.body);

    const { email, confirmationCode } = JSON.parse(event.body);

    
    try {
        // if ([email, confirmationCode].some((field) => field?.trim() === "")) {
        //     // return response(400, false, null, "Email and confirmation code are required", "INVALID_INPUT");
        //     const error = new Error("Email and confirmation code are required");
        //     error.code = "INVALID_INPUT";
        //     throw error;
        // }
        
        const confirmSignUp = await verifyRegister(email, confirmationCode);
        console.log("Confirm SignUp : ",confirmSignUp);

        
        const userData = await getUser(email);
        console.log("user Data : ",userData);
        
        const userSub = userData.UserAttributes.find(attr => attr.Name === "sub")?.Value;
        const role = userData.UserAttributes.find(attr => attr.Name === "custom:role")?.Value;
        console.log("userSub : ",userData,"  =======>  role : ",role);
        // const role = userData.UserAttributes.find(attr => attr.Name === "custom:custom:role")?.Value;
        
        const addUserToGroup = await assignGroup(email,role);
        console.log("addUserToGroup : ",addUserToGroup);
       

        const insertUser = await addRegisterdUser({userSub,email,role});

        return response({
            statusCode: 201,
            isSuccess: true,
            data: insertUser,
            message:'Your account has been successfully confirmed. You can now log in.'
        });

    } catch (error) {
        console.error("[confirmSignUp.js]    ==========> ", error);
        return response({
            statusCode: 400,
            isSuccess: false,
            message:'Error on Confirming User..!',
            error:error.message
        });
    }
};