class ApiError extends Error{   
    constructor(
        statusCode, 
        message = "Something went wrong",
        errors = [],
        stack = ""
    ){
        super(message);
        this.statusCode = statusCode;
        this.data = null;
        this.message = message;
        this.success = false;
        this.errors = errors;
        this.isBase64Encoded = false;
        this.headers = {
            "Access-Control-Allow-Origin": "*"
        };

        if(stack){
            this.stack = stack;
        }else{
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export { ApiError };