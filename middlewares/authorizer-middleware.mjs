export const authorizeByGroup = (allowedGroups) => async (handler) => {
    
    const userGroup = handler.event.identity?.groups.toString(); 
    // console.log("userGroup : ",userGroup);
    if(!allowedGroups.includes(userGroup)){ 
        throw new Error("Unauthorized Access"); 
    }
}

//  ====> REST API :

// import { generateResponse } from "../utils/response.mjs";

// export const authorizeByGroup = (allowedGroups) => async (handler) => {
//     const claims = handler.event.requestContext?.authorizer?.claims;
//     const userGroup = claims['cognito:groups']; 

//     if(!allowedGroups.includes(userGroup)){

//         return generateResponse({
//             statusCode: 401,
//             isSuccess: false,
//             error: "Unauthorized Access"
//         });
        
//     }
    
// }