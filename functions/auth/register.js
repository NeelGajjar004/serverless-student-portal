import { register } from "../../utils/cognito.js";
import { response } from "../../utils/response.js"; 

export const handler = async (event,context) => {    
    // console.log("Event Body : ", event.body);
    
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

        const signUp = await register(email,password,role);

        // console.log(signUp);

        return response({
            statusCode: 201,
            isSuccess: true,
            data: signUp,
            message:'User registered successfully. Please Check Your Email for Confirmation.'
        });
    } catch (error) {
        console.error("[register.js]    ==========> ",error);
        return response({
            statusCode: 400,
            isSuccess: false,
            message:'Error on Registering User..!',
            error:error.message
        });
    }

}