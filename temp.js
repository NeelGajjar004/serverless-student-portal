import { apiError } from "./utils/apiError.js";
function temp(userName,email){
        // let Email = email;
        // const userName = userName;
    
        try {
            // fields validation 
            if([userName,email].some((field) => field?.trim() === "")){
    
                // console.log("All fields[userName, email, password, role] are required...!");
                throw new apiError(400,"all fields are required");
                // return "All fields[userName, email] are required...!";            
            }
    
            return {userName,email};
        } catch (error) {
            console.log(error);
        }
}

function Calltemp(){
        var c1 = temp("admin","");
        console.log(temp("admin"," "));
        console.log(c1);
        // console.log(c1.userName);
        // console.log(c1.email);
        console.log("calltemp log");
}

Calltemp();