import { getUsersListByRoles } from "../../utils/dynamodb.mjs";

const { STUDENT_GROUP, USER_TABLE } = process.env;

export const handler = async (event) => {

    console.log("Event : ",event);
    
    try {
        const studentList = await getUsersListByRoles({ tableName:USER_TABLE, role:STUDENT_GROUP });

        if(!studentList){
            throw new Error('Students not Found..')
        }

        return studentList;
        
    } catch (error) {
        console.error("[student-list.mjs]    ==========> ", error);

        throw new Error(`${error.name} : ${error.message}`);   
        
    }
}

// GraphQL API :

// import middy from "@middy/core";
// import { getUsersListByRoles } from "../../utils/dynamodb.mjs";
// import { authorizeByGroup } from "../../middlewares/authorizer-middleware.mjs";

// const { STUDENT_GROUP, FACULTY_GROUP, USER_TABLE } = process.env;

// const handler = middy(async (event) => {

//     console.log("Event : ",event);
    
//     try {
//         const studentList = await getUsersListByRoles({ tableName:USER_TABLE, role:STUDENT_GROUP });

//         if(!studentList){
//             throw new Error('Students not Found..')
//         }

//         return studentList;
        
//     } catch (error) {
//         console.error("[student-list.mjs]    ==========> ", error);

//         throw new Error(error.name+" : "+error.message);   
        
//     }
// });

// handler.use({
//     before: authorizeByGroup([ FACULTY_GROUP ])
// });

// export { handler }

//  ====> REST API :
// import middy from "@middy/core";
// import { getUsersListByRoles } from "../../utils/dynamodb.mjs";
// import { generateResponse } from "../../utils/response.mjs";
// import { authorizeByGroup } from "../../middlewares/authorizer-middleware.mjs";

// const { STUDENT_GROUP, FACULTY_GROUP, USER_TABLE } = process.env;

// const handler = middy(async (event) => {
    
//     try {
//         const studentList = await getUsersListByRoles({ tableName:USER_TABLE, role:STUDENT_GROUP });

//         return generateResponse({
//             statusCode: 200,
//             isSuccess: true,
//             data: studentList,
//             message:'students list fetched successfully...'
//         });
        
//     } catch (error) {
//         console.error("[student-list.mjs]    ==========> ", error);

//         return generateResponse({
//             statusCode: 500,
//             isSuccess: false,
//             message:'error on listing students..!',
//             error:error.name+" : "+error.message
//         });   
        
//     }
// });

// handler.use({
//     before: authorizeByGroup([ FACULTY_GROUP ])
// });

// export { handler }
