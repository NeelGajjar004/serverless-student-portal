class apiError extends Error{   
    constructor(
        statusCode, 
        message = "Something went wrong",
        error = null
    ){
        
        super(message);
        this.statusCode = statusCode,
        this.isBase64Encoded = false;
        this.headers = {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        },
        this.body = JSON.stringify({
            success: false,
            message: message,
            error: error
        })
    }
}


// export const ApiError = async () => {}




    // constructor(
    //     statusCode, 
    //     message = "Something went wrong",
    //     errors = []
    // ){
        
    //     super(message);
    //     this.statusCode = statusCode,
    //     this.isBase64Encoded = false;
    //     this.headers = {
    //         "Content-Type": "application/json",
    //         "Access-Control-Allow-Origin": "*",
    //     },
    //     this.body = JSON.stringify({
    //         success: false,
    //         error: errors,
    //         message: message,
    //     })


    //     // this.statusCode = statusCode;
    //     // this.data = null;
    //     // this.message = message;
    //     // this.success = false;
    //     // this.errors = errors;
    //     // this.isBase64Encoded = false;
    //     // this.headers = {
    //     //     "Access-Control-Allow-Origin": "*"
    //     // };

    //     // if(stack){
    //     //     this.stack = stack;
    //     // }else{
    //     //     Error.captureStackTrace(this, this.constructor);
    //     // }

    //     // this.statusCode = statusCode,
    //     // this.isBase64Encoded = false;
    //     // this.headers = {
    //     //     "Content-Type": "application/json",
    //     //     "Access-Control-Allow-Origin": "*",
    //     // },
    //     // this.body = JSON.stringify({
    //     //     success:true,
    //     //     data: data,
    //     //     message: message,
    //     // })




    // }
// }
// class ApiError extends Error{   
//     constructor(
//         statusCode, 
//         message = "Something went wrong",
//         errors = [],
//         stack = ""
//     ){
//         super(message);
//         this.statusCode = statusCode;
//         this.data = null;
//         this.message = message;
//         this.success = false;
//         this.errors = errors;
//         this.isBase64Encoded = false;
//         this.headers = {
//             "Access-Control-Allow-Origin": "*"
//         };

//         if(stack){
//             this.stack = stack;
//         }else{
//             Error.captureStackTrace(this, this.constructor);
//         }
//     }
// }

export { apiError };