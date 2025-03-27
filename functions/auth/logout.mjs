// import { logout } from "../../utils/cognito.mjs";

// export const handler = async (event, context) => {

//     console.log("Event : ",event);
//     console.log("Context : ",context);

//     const { accessToken } = event.arguments.input;
    
//     try {
//         const globalSignOut = await logout({ accessToken:accessToken });
        
//         if (!globalSignOut) {
//             throw new Error("Login failed. No response from Cognito.");
//         }

//         return JSON.stringify(globalSignOut);

//     } catch (error) {
//         console.error("[logout.mjs]    ==========> ", error);

//         throw new Error(error.message || "Error on Logging Out User..!")

//     }
// }

//  ====> REST API : 
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