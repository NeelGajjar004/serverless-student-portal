import { login } from "../../utils/cognito.js";
import { response } from "../../utils/response.js";

export const handler = async (event, context) => {
    // console.log("Event Body : ", event.body);
    
    const { email, password } = JSON.parse(event.body);
    try {
        // if ([email].some((field) => field?.trim() === "")) {
        //     const error = new Error("Email are required");
        //     error.code = "INVALID_INPUT";
        //     throw error;
        // }
        const InitiateAuth = await login(email,password);

        return response({
            statusCode: 200,
            isSuccess: true,
            data: InitiateAuth,
            message:'User Login successfully...'
        });
    } catch (error) {
        console.error("[login.js] ==========>", error);
        
        let errorMessage = error.message;
    
        switch (error.name) {
            case "NotAuthorizedException":
                errorMessage = "Incorrect Email or Password";
                break;
    
            case "InvalidParameterException":
                errorMessage = error.message === "Missing required parameter PASSWORD" ? "Password cannot be blank." : "Missing required authentication parameters: email, password";
                break;
        }
    
        return response({
            statusCode: 400,
            isSuccess: false,
            message: "Error logging in user..!",
            error: errorMessage
        });
    }
};