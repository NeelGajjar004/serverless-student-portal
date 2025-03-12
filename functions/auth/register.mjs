import { register } from "../../utils/cognito.mjs";
import { generateResponse } from "../../utils/response.mjs"; 

export const handler = async (event) => {    
    
    const { email, password, role } = JSON.parse(event.body);

    try {
        // if([email,role].some((field) => field?.trim() === "")){
        //     // return response(400,false,null,"All fields are required","INVALID_INPUT");
        //     const error = new Error("Error : All fields are required: email, role");
        //     error.code = "INVALID_INPUT";
        //     throw error;
        // }
        
        // if(!['SuperAdmin','Faculty','Student'].includes(role)){
        //     // return response(400,false,null,"Invalid role. Allowed roles: SuperAdmin, Faculty, Student","INVALID_ROLE");
        //     const error = new Error("Invalid role. Allowed roles: SuperAdmin, Faculty, Student");
        //     error.code = "INVALID_ROLE";
        //     throw error;
        // }

        const signUp = await register({ email:email, password:password, role:role });

        return generateResponse({
            statusCode: 201,
            isSuccess: true,
            data: signUp,
            message:'User registered successfully. Please Check Your Email for Confirmation.'
        });

    } catch (error) {
        console.error("[register.mjs]    ==========> ",error);

        return generateResponse({
            statusCode: 400,
            isSuccess: false,
            message:'Error on Registering User..!',
            error:error.message
        });

    }
}