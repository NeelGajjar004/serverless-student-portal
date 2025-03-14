import { generateResponse } from "../utils/response.mjs";

export const authorizeByGroup = (allowedGroups) => async (handler) => {
    const claims = handler.event.requestContext?.authorizer?.claims;
    const userGroup = claims['cognito:groups']; 

    if(!allowedGroups.includes(userGroup)){

        return generateResponse({
            statusCode: 401,
            isSuccess: false,
            error: "Unauthorized Access"
        });
        
    }
    
}