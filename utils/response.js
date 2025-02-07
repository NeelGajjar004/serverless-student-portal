export const response = (statusCode,success,data,message = "",error,errorCode = null) => {
    return {
        statusCode : statusCode,
        headers : {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        },
        body : JSON.stringify({
            success : success,
            data : data,
            message : message,
            error : error,
            errorCode : errorCode,
        }),
    }
}