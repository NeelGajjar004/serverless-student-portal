import { updateRecord, getRecord } from "../../utils/dynamodb.js";
import { response } from "../../utils/response.js";
const { FACULTY_GROUP, USER_TABLE } = process.env;


export const handler = async (event) => {
    
    const claims = event.requestContext?.authorizer?.claims;
    console.log("requested User Claims : ",claims);
    // const userGroup = (claims['cognito:groups'] || '').split(','); // user belongs to multiple groups
    const userGroup = claims['cognito:groups']; // user belongs to only one groups

    if(userGroup !== FACULTY_GROUP){
        return response({
            statusCode: 401,
            isSuccess: false,
            message:'Error on Updating Student User..!',
            error:"Unauthorized Access"
        });
    }

    const { studentId } = event.pathParameters;
    console.log("student Id : ",studentId);
    const { details } = JSON.parse(event.body);

    console.log("details ===> ",details);

    
    try {
        const updatedBy = claims?.email;
        const Key = { userId: studentId };

        const existingUser = await getRecord({
            tableName: USER_TABLE,
            key: Key
        });

        if (!existingUser || !existingUser.Item) {
            const error = new Error("User Not Found..!");
            error.name = "USER_NOT_FOUND_EXCEPTION";
            throw error;
        }

        const UpdateExp = 'SET details = :details, updatedBy = :updatedBy';
        
        const ExpAttName = { 'details' : 'details', ':updatedBy' : 'updatedBy' };
        // console.log("expAttName : ",ExpAttName);

        const ExpAttVal = { ':details' : details, ':updatedBy' : updatedBy };

        const updatedStudent = await updateRecord({
            tableName: USER_TABLE,
            key:Key,
            updateExp:UpdateExp,
            expAttName:ExpAttName,
            expAttVal: ExpAttVal
        });

        return response({
            statusCode: 200,
            isSuccess: true,
            data: updatedStudent,
            message:'Student Details Updated Successfully...'
        });
        
    } catch (error) {
        console.error("[update-student.js]    ==========> ", error);
        return response({
            statusCode: 500,
            isSuccess: false,
            message:'Error on Updating Student User..!',
            error:error.name+" : "+error.message
        });   
    }
}





//Previous Version of Update Student 


// import { updateRecord, getRecord } from "../../utils/dynamodb.js";
// import { response } from "../../utils/response.js";
// const { FACULTY_GROUP, USER_TABLE } = process.env;


// export const handler = async (event) => {
    
//     const claims = event.requestContext?.authorizer?.claims;
//     console.log("requested User Claims : ",claims);
//     // const userGroup = (claims['cognito:groups'] || '').split(','); // user belongs to multiple groups
//     const userGroup = claims['cognito:groups']; // user belongs to only one groups

//     if(userGroup !== FACULTY_GROUP){
//         return response({
//             statusCode: 401,
//             isSuccess: false,
//             message:'Error on Updating Student User..!',
//             error:"Unauthorized Access"
//         });
//     }

//     const { studentId } = event.pathParameters;
//     console.log("student Id : ",studentId);
//     const { department, classNo } = JSON.parse(event.body);
    
//     try {
//         if ([department,classNo].some((field) => field?.trim() === "")) {
//             const error = new Error("Department & Class No are required");
//             error.name = "INVALID_INPUT";
//             throw error;
//         }
//         const Key = {
//             userId: studentId
//         }

//         const existingUser = await getRecord({
//             tableName: USER_TABLE,
//             key: Key
//         });

//         if (!existingUser || !existingUser.Item) {
//             const error = new Error("User Not Found..!");
//             error.name = "USER_NOT_FOUND_EXCEPTION";
//             throw error;
//         }

//         const UpdateExp = 'SET department = :department, classNo = :classNo';
//         const CondExp = 'attribute_exists(userId) AND role = :role';
//         const ExpAttVal = {
//             ':department' : department,
//             ':classNo' : classNo
//             // ':role' : 'Student'
//         }

//         const updatedStudent = await updateRecord({
//             tableName: USER_TABLE,
//             key:Key,
//             updateExp:UpdateExp,
//             condExp:CondExp,
//             expAttVal: ExpAttVal
//         });

//         return response({
//             statusCode: 200,
//             isSuccess: true,
//             data: updatedStudent,
//             message:'Student Details Updated Successfully...'
//         });
        
//     } catch (error) {
//         console.error("[update-student.js]    ==========> ", error);
//         return response({
//             statusCode: 500,
//             isSuccess: false,
//             message:'Error on Updating Student User..!',
//             error:error.name+" : "+error.message
//         });   
//     }
// }
