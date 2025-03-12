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