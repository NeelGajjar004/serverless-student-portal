class ApiResponse{
    constructor(statusCode, data, message = "Success"){
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = statusCode < 400;
        this.isBase64Encoded = false;
        this.headers = {
            "Access-Control-Allow-Origin": "*"
        };
    }
}

export { ApiResponse };