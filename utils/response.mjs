export const generateResponse = ({statusCode,isSuccess,data = null,message = null,error = null}) => {
    
    return {
        statusCode : statusCode,
        headers : {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        },
        body : JSON.stringify({
            success : isSuccess,
            data : data,
            message : message,
            error : error
        }),
    }
}