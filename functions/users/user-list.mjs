import middy from "@middy/core";
import { recordsList } from "../../utils/dynamodb.mjs";
import { generateResponse } from "../../utils/response.mjs";
import { authorizeByGroup } from "../../middleware/before-middleware.mjs";

const { SUPER_ADMIN_GROUP, USER_TABLE } = process.env;

const handler = middy(async (event) => {

    try {
        const userlist = await recordsList({ tableName:USER_TABLE });

        return generateResponse({
            statusCode: 200,
            isSuccess: true,
            data: userlist,
            message:'users list fetched successfully...'
        });
        
    } catch (error) {
        console.error("[user-list.mjs]    ==========> ", error);

        return generateResponse({
            statusCode: 500,
            isSuccess: false,
            message:'error on listing users..!',
            error:error.name+" : "+error.message
        });   
        
    }
});

handler.use({
    before: authorizeByGroup([ SUPER_ADMIN_GROUP ])
});

export { handler }