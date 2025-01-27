class apiResponse{
    constructor(statusCode,success, data, message = "Success"){
        this.statusCode = statusCode,
        this.isBase64Encoded = false;
        this.headers = {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        },
        this.body = JSON.stringify({
            success:success,
            data: data,
            message: message,
        })
    }
}

export { apiResponse };