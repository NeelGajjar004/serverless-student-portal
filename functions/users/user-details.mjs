import { getRecord } from "../../utils/dynamodb.mjs";

const { USER_TABLE } = process.env;

export const handler = async (event) => {
    
    console.log("Event : ",event);
    const userId = event.identity.claims?.sub;
    
    try {
        const key = { userId: userId };

        const userDetails = await getRecord({ tableName: USER_TABLE, key: key });

        if (!userDetails || !userDetails.Item) {
            const error = new Error("User Not Found..!");
            error.name = "USER_NOT_FOUND_EXCEPTION";
            throw error;
        }

        return userDetails.Item;
        
    } catch (error) {
        console.error("[user-details.mjs]    ==========> ", error);

        throw new Error(error.name+" : "+error.message); 

    }
}

// GraphQL API :

// import middy from "@middy/core";
// import { getRecord } from "../../utils/dynamodb.mjs";
// import { authorizeByGroup } from "../../middlewares/authorizer-middleware.mjs";

// const { SUPER_ADMIN_GROUP, FACULTY_GROUP, STUDENT_GROUP, USER_TABLE } = process.env;

// const handler = middy(async (event) => {
    
//     console.log("Event : ",event);
//     const userId = event.identity.claims?.sub;
//     console.log("userId : ",userId);
    
//     try {
//         const key = { userId: userId };

//         const userDetails = await getRecord({ tableName: USER_TABLE, key: key });

//         if (!userDetails || !userDetails.Item) {
//             const error = new Error("User Not Found..!");
//             error.name = "USER_NOT_FOUND_EXCEPTION";
//             throw error;
//         }

//         return userDetails.Item;
        
//     } catch (error) {
//         console.error("[user-details.mjs]    ==========> ", error);

//         throw new Error(error.name+" : "+error.message); 

//     }
// });

// handler.use({
//     before: authorizeByGroup([ SUPER_ADMIN_GROUP, FACULTY_GROUP, STUDENT_GROUP ])
// });

// export { handler }

//  ====> REST API :
// import middy from "@middy/core";
// import { getRecord } from "../../utils/dynamodb.mjs";
// import { generateResponse } from "../../utils/response.mjs";
// import { authorizeByGroup } from "../../middlewares/authorizer-middleware.mjs";

// const { SUPER_ADMIN_GROUP, FACULTY_GROUP, STUDENT_GROUP, USER_TABLE } = process.env;

// const handler = middy(async (event) => {
    
//     const claims = event.requestContext?.authorizer?.claims;
//     const userId = claims['sub'];
    
//     try {
//         const key = { userId: userId };

//         const userDetails = await getRecord({ tableName: USER_TABLE, key: key });

//         return generateResponse({
//             statusCode: 200,
//             isSuccess: true,
//             data: userDetails.Item,
//             message:'user details fetched successfully...'
//         });
        
//     } catch (error) {
//         console.error("[user-details.mjs]    ==========> ", error);

//         return generateResponse({
//             statusCode: 500,
//             isSuccess: false,
//             message:'error on getting user details..!',
//             error:error.name+" : "+error.message
//         }); 

//     }
// });

// handler.use({
//     before: authorizeByGroup([ SUPER_ADMIN_GROUP, FACULTY_GROUP, STUDENT_GROUP ])
// });

// export { handler }
