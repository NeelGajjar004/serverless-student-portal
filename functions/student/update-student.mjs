import { updateRecord, getRecord } from "../../utils/dynamodb.mjs";

const { USER_TABLE } = process.env;

export const handler = async (event) => {
    
    console.log("Event : ",event);
    const { requestedUser } = event;
    const { userId, details } = event.arguments;
    
    try {
        const updatedBy = requestedUser;
        const updatedAt = new Date().toISOString();
        const key = { userId: userId };
        const existingUser = await getRecord({ tableName: USER_TABLE, key: key });

        if (!existingUser || !existingUser.Item) {
            const error = new Error("User Not Found..!");
            error.name = "USER_NOT_FOUND_EXCEPTION";
            throw error;
        }

        const UpdateExp = 'SET details = :details, updatedBy = :updatedBy, updatedAt = :updatedAt';
        const ExpAttVal = { ':details' : details, ':updatedBy' : updatedBy, ':updatedAt' : updatedAt };

        const updatedStudent = await updateRecord({ tableName: USER_TABLE, key:key, updateExp:UpdateExp, expAttVal: ExpAttVal });

        console.log("updated Student : ",updatedStudent);

        return updatedStudent.Attributes;
        
    } catch (error) {
        console.error("[update-student.mjs]    ==========> ", error);

        throw new Error(`${error.name} : ${error.message}`);   

    }
}


// GraphQL API :

// import middy from "@middy/core";
// import { updateRecord, getRecord } from "../../utils/dynamodb.mjs";
// import { authorizeByGroup } from "../../middlewares/authorizer-middleware.mjs";

// const { FACULTY_GROUP, USER_TABLE } = process.env;

// const handler = middy(async (event) => {
    
//     console.log("Event : ",event);
//     const { requestedUser } = event;
//     const { userId, details } = event.arguments;
    
//     try {
//         const updatedBy = requestedUser;
//         const updatedAt = new Date().toISOString();
//         const key = { userId: userId };
//         const existingUser = await getRecord({ tableName: USER_TABLE, key: key });

//         if (!existingUser || !existingUser.Item) {
//             const error = new Error("User Not Found..!");
//             error.name = "USER_NOT_FOUND_EXCEPTION";
//             throw error;
//         }

//         const UpdateExp = 'SET details = :details, updatedBy = :updatedBy, updatedAt = :updatedAt';
//         const ExpAttVal = { ':details' : details, ':updatedBy' : updatedBy, ':updatedAt' : updatedAt };

//         const updatedStudent = await updateRecord({ tableName: USER_TABLE, key:key, updateExp:UpdateExp, expAttVal: ExpAttVal });

//         console.log("updated Student : ",updatedStudent);

//         return updatedStudent.Attributes;
        
//     } catch (error) {
//         console.error("[update-student.mjs]    ==========> ", error);

//         throw new Error(error.message);   

//     }
// });

// handler.use({
//     before: authorizeByGroup([ FACULTY_GROUP ])
// });

// export { handler }

//  ====> REST API :
// import middy from "@middy/core";
// import { updateRecord, getRecord } from "../../utils/dynamodb.mjs";
// import { generateResponse } from "../../utils/response.mjs";
// import { authorizeByGroup } from "../../middlewares/authorizer-middleware.mjs";

// const { FACULTY_GROUP, USER_TABLE } = process.env;

// const handler = middy(async (event) => {
    
//     const claims = event.requestContext?.authorizer?.claims;

//     const { studentId } = event.pathParameters;
//     // console.log("student Id : ",studentId);
//     const { details } = JSON.parse(event.body);
//     // console.log("details ===> ",details);
    
//     try {
//         const updatedBy = claims?.email;
//         const key = { userId: studentId };
//         const existingUser = await getRecord({ tableName: USER_TABLE, key: key });

//         if (!existingUser || !existingUser.Item) {
//             const error = new Error("User Not Found..!");
//             error.name = "USER_NOT_FOUND_EXCEPTION";
//             throw error;
//         }

//         const UpdateExp = 'SET details = :details, updatedBy = :updatedBy';
//         const ExpAttVal = { ':details' : details, ':updatedBy' : updatedBy };

//         const updatedStudent = await updateRecord({ tableName: USER_TABLE, key:key, updateExp:UpdateExp, expAttVal: ExpAttVal });

//         return generateResponse({
//             statusCode: 200,
//             isSuccess: true,
//             data: updatedStudent,
//             message:'student details updated successfully...'
//         });
        
//     } catch (error) {
//         console.error("[update-student.mjs]    ==========> ", error);

//         return generateResponse({
//             statusCode: 500,
//             isSuccess: false,
//             message:'error on updating student..!',
//             error:error.name+" : "+error.message
//         });   

//     }
// });

// handler.use({
//     before: authorizeByGroup([ FACULTY_GROUP ])
// });

// export { handler }