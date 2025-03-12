import { verifyRegister, assignGroup,getUser } from "../../utils/cognito.mjs";
import { addRegisterdUserToDB } from "../../utils/dynamodb.mjs";
import { generateResponse } from "../../utils/response.mjs";

export const handler = async (event) => {

    const { email, confirmationCode } = JSON.parse(event.body);
    
    try {
        // if ([email, confirmationCode].some((field) => field?.trim() === "")) {
        //     const error = new Error("Email and confirmation code are required");
        //     error.code = "INVALID_INPUT";
        //     throw error;
        // }
        
        const confirmSignUp = await verifyRegister({ email:email, confirmationCode:confirmationCode });
        const userData = await getUser({ email:email });
        const userSub = userData.UserAttributes.find(attr => attr.Name === "sub")?.Value;
        const role = userData.UserAttributes.find(attr => attr.Name === "custom:role")?.Value;
        const addUserToGroup = await assignGroup({ email:email, role:role });

        const insertUserToDB = await addRegisterdUserToDB({userSub,email,role});

        return generateResponse({
            statusCode: 201,
            isSuccess: true,
            data: insertUserToDB,
            message:'Your account has been successfully confirmed. You can now log in.'
        });

    } catch (error) {
        console.error("[confirmSignUp.mjs]    ==========> ", error);

        return generateResponse({
            statusCode: 400,
            isSuccess: false,
            message:'Error on Confirming User..!',
            error:error.message
        });

    }
}