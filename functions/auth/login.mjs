// import { login } from "../../utils/cognito.mjs";

// export const handler = async (event, context) => {
    
//     console.log("Event : ",event);
//     console.log("Context : ",context);
//     const { email, password } = event;

//     try {
//         const initiateAuth = await login({ email:email, password:password });
        
//         if (!initiateAuth) {
//             throw new Error("Login failed. No response from Cognito.");
//         }

//         return JSON.stringify(initiateAuth);

//     } catch (error) {
//         console.error("[login.mjs] ==========>", error);
        
//         let errorMessage = error.message;
    
//         switch (error.name) {
//             case "NotAuthorizedException":
//                 errorMessage = "Incorrect email or password";
//                 break;
    
//             case "InvalidParameterException":
//                 errorMessage = error.message === "Missing required parameter PASSWORD" ? "Password cannot be blank." : "Missing required authentication parameters: email, password";
//                 break;
//         }
    
//         throw new Error(errorMessage || "Failed to logging in user");

//     }
// }



//  ====> REST API :
import { login } from "../../utils/cognito.mjs";
import { generateResponse } from "../../utils/response.mjs";

export const handler = async (event) => {
    
    const { email, password } = JSON.parse(event.body);

    try {
        // if ([email].some((field) => field?.trim() === "")) {
        //     const error = new Error("Email are required");
        //     error.code = "INVALID_INPUT";
        //     throw error;
        // }

        const initiateAuth = await login({ email:email, password:password });

        return generateResponse({
            statusCode: 200,
            isSuccess: true,
            data: initiateAuth,
            message:'user login successfully...'
        });

    } catch (error) {
        console.error("[login.mjs] ==========>", error);
        
        let errorMessage = error.message;
    
        switch (error.name) {
            case "NotAuthorizedException":
                errorMessage = "Incorrect email or password";
                break;
    
            case "InvalidParameterException":
                errorMessage = error.message === "Missing required parameter PASSWORD" ? "Password cannot be blank." : "Missing required authentication parameters: email, password";
                break;
        }
    
        return generateResponse({
            statusCode: 400,
            isSuccess: false,
            message: "error logging in user..!",
            error: errorMessage
        });

    }
}