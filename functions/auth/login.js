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
        console.error("[login.js]    ==========> ", error);
        return response({
            statusCode: 500,
            isSuccess: false,
            message:'Error on logging in User..!',
            error:error.message
        });
    }
};





// export const handler = async (event, context) => {
//     console.log("Event Body : ", event.body);

//     const { email, password } = JSON.parse(event.body);

//     if ([email, password].some((field) => field?.trim() === "")) {
//         return response(401, false, null, "Email and password are required", "INVALID_INPUT");
//     }

//     try {
//         const loginResponse = await cognitoClient.send(new InitiateAuthCommand({
//             AuthFlow: "USER_PASSWORD_AUTH", // Use USER_PASSWORD_AUTH for username/password login
//             ClientId: USER_POOL_CLIENT,
//             AuthParameters: {
//                 USERNAME: email,
//                 PASSWORD: password,
//             },
//         }));
//         console.log("Login Response : ",loginResponse);
//         console.log("Login Authentication Result : ",loginResponse.AuthenticationResult);
//         // Extract tokens from the response
//         const { AccessToken, RefreshToken, IdToken } = loginResponse.AuthenticationResult;

//         // Decode the ID token to extract group information
//         const decodedToken = jwt.decode(IdToken);
//         const userGroups = decodedToken?.["cognito:groups"] || []; // Extract groups from the token

//         return response(200, true, {
//             accessToken: AccessToken,
//             refreshToken: RefreshToken,
//             idToken: IdToken,
//             userGroups: userGroups,
//         }, "User Login successfully...");
//     } catch (error) {
//         console.error("[login.js]    ==========> ", error);
//         return response(400, false, null, "Error logging in", error.message);
//     }
// };