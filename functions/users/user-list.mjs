import { recordsList } from "../../utils/dynamodb.mjs";

const { USER_TABLE } = process.env;

export const handler = async (event) => {

    console.log("Event : ",event);

    try {
        const userList = await recordsList({ tableName:USER_TABLE });

        if(!userList){
            throw new Error('Users not Found..')
        }
        
        return userList;

    } catch (error) {
        console.error("[user-list.mjs]    ==========> ", error);

        throw new Error(error.name+" : "+error.message);   
        
    }
}


// GraphQL API :

// import middy from "@middy/core";
// import { recordsList } from "../../utils/dynamodb.mjs";
// import { authorizeByGroup } from "../../middlewares/authorizer-middleware.mjs";

// const { SUPER_ADMIN_GROUP, USER_TABLE } = process.env;

// const handler = middy(async (event) => {

//     console.log("Event : ",event);

//     try {
//         const userList = await recordsList({ tableName:USER_TABLE });

//         if(!userList){
//             throw new Error('Users not Found..')
//         }
        
//         return userList;

//     } catch (error) {
//         console.error("[user-list.mjs]    ==========> ", error);

//         throw new Error(error.name+" : "+error.message);   
        
//     }
// });

// handler.use({
//     before: authorizeByGroup([ SUPER_ADMIN_GROUP ])
// });

// export { handler }

//  ====> REST API :
// import middy from "@middy/core";
// import { recordsList } from "../../utils/dynamodb.mjs";
// import { generateResponse } from "../../utils/response.mjs";
// import { authorizeByGroup } from "../../middlewares/authorizer-middleware.mjs";

// const { SUPER_ADMIN_GROUP, USER_TABLE } = process.env;

// const handler = middy(async (event) => {

//     try {
//         const userlist = await recordsList({ tableName:USER_TABLE });

//         return generateResponse({
//             statusCode: 200,
//             isSuccess: true,
//             data: userlist,
//             message:'users list fetched successfully...'
//         });
        
//     } catch (error) {
//         console.error("[user-list.mjs]    ==========> ", error);

//         return generateResponse({
//             statusCode: 500,
//             isSuccess: false,
//             message:'error on listing users..!',
//             error:error.name+" : "+error.message
//         });   
        
//     }
// });

// handler.use({
//     before: authorizeByGroup([ SUPER_ADMIN_GROUP ])
// });

// export { handler }