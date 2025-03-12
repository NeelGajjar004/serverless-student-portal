import { logout } from "../../utils/cognito.mjs";
import { generateResponse } from "../../utils/response.mjs";


export const handler = async (event) => {

    const { accessToken } = JSON.parse(event.body);
    
    try {
        // if (!accessToken || accessToken.trim() === "") {
        //     const error = new Error("Access token is required");
        //     error.code = "INVALID_TOKEN_INPUT";
        //     throw error;
        // }
        
        const globalSignOut = await logout({ accessToken:accessToken });

        return generateResponse({
            statusCode: 200,
            isSuccess: true,
            data: globalSignOut,
            message:'User Logout successfully..!'
        });

    } catch (error) {
        console.error("[logout.mjs]    ==========> ", error);
        
        return generateResponse({
            statusCode: 400,
            isSuccess: false,
            message:'Error on Logging Out User..!',
            error:error.message
        });

    }
}