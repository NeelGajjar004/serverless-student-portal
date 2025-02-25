import { logout } from "../../utils/cognito.js";
import { response } from "../../utils/response.js";


export const handler = async (event, context) => {
    // console.log("Event Body : ", event.body);

    const { accessToken } = JSON.parse(event.body);
    
    try {
        // if (!accessToken || accessToken.trim() === "") {
        //     // return response(400, false, null, "Access token is required", "INVALID_INPUT");
        //     const error = new Error("Access token is required");
        //     error.code = "INVALID_TOKEN_INPUT";
        //     throw error;
        // }
        const globalSignOut = await logout(accessToken);

        console.log("Logout Response : ",globalSignOut);

        return response({
            statusCode: 200,
            isSuccess: true,
            data: globalSignOut,
            message:'User Logout successfully..!'
        });
    } catch (error) {
        console.error("[logout.js]    ==========> ", error);
        return response({
            statusCode: 400,
            isSuccess: false,
            message:'Error on Registering User..!',
            error:error.message
        });
    }
};