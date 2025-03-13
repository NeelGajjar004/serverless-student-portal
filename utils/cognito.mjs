import { CognitoIdentityProviderClient, AdminCreateUserCommand, SignUpCommand, ConfirmSignUpCommand, AdminAddUserToGroupCommand, InitiateAuthCommand, GlobalSignOutCommand, AdminGetUserCommand, AdminSetUserPasswordCommand, AdminDeleteUserCommand } from "@aws-sdk/client-cognito-identity-provider";
import jwt from "jsonwebtoken";

const { USER_POOL, USER_POOL_CLIENT, FACULTY_GROUP, STUDENT_GROUP } = process.env;
const cognitoClient = new CognitoIdentityProviderClient();

export const register = async ({ email, password, role }) => {

    if([email,role].some((field) => field?.trim() === "")){
        const error = new Error("Error : All fields are required: email, role");
        error.code = "INVALID_INPUT";
        throw error;
    }
    
    if(!['SuperAdmin','Faculty','Student'].includes(role)){
        const error = new Error("Invalid role. Allowed roles: SuperAdmin, Faculty, Student");
        error.code = "INVALID_ROLE";
        throw error;
    }

    const signUp =  await cognitoClient.send(
        new SignUpCommand({
            ClientId: USER_POOL_CLIENT,
            Username: email,
            Password: password,
            UserAttributes: [
                { Name: 'email', Value: email },
                { Name: 'custom:role', Value: role }
            ],
        })
    );
    
    return signUp;
}

export const verifyRegister = async ({ email, confirmationCode }) => {

    if ([email, confirmationCode].some((field) => field?.trim() === "")) {
        const error = new Error("Email and confirmation code are required");
        error.code = "INVALID_INPUT";
        throw error;
    }

    const confirmSignUp = await cognitoClient.send(new ConfirmSignUpCommand({
        ClientId: USER_POOL_CLIENT,
        Username: email,
        ConfirmationCode: confirmationCode,
    }));

    return confirmSignUp;
}

export const getUser = async ({ email }) => {

    const userDetails = await cognitoClient.send(new AdminGetUserCommand({
        UserPoolId: USER_POOL,
        Username: email,
    }));

    return userDetails;
}

export const assignGroup = async ({ email, role }) => {
    
    const addUserToGroup = await cognitoClient.send(
        new AdminAddUserToGroupCommand({
            UserPoolId: USER_POOL,
            Username: email,
            GroupName: role
        })
    );

    return addUserToGroup;
}

export const login = async ({ email, password }) => {
    
    if ([email].some((field) => field?.trim() === "")) {
        const error = new Error("Email are required");
        error.code = "INVALID_INPUT";
        throw error;
    }

    const signIn = await cognitoClient.send(new InitiateAuthCommand({
        AuthFlow: "USER_PASSWORD_AUTH", // Use USER_PASSWORD_AUTH for username/password login
        ClientId: USER_POOL_CLIENT,
        AuthParameters: {
            USERNAME: email,
            PASSWORD: password,
        },
    }));

    // Extract tokens from the response
    const { AccessToken, RefreshToken, IdToken } = signIn.AuthenticationResult;

    // Decode the ID token to extract group information
    const decodedToken = jwt.decode(IdToken);
    const userGroups = decodedToken?.["cognito:groups"] || [];

    return { AccessToken, RefreshToken, IdToken, userGroups };
}

export const logout = async ({ accessToken }) => {
    
    if (!accessToken || accessToken.trim() === "") {
        const error = new Error("Access token is required");
        error.code = "INVALID_TOKEN_INPUT";
        throw error;
    }

    const signOut = await cognitoClient.send(new GlobalSignOutCommand({
        AccessToken: accessToken, // The access token of the user to log out
    }));

    return signOut;
}

export const createCognitoUser = async({ email, password, isStudent = true }) => {

    if ([email].some((field) => field?.trim() === "")) {
        const error = new Error("Email are required");
        error.code = "INVALID_INPUT";
        throw error;
    }

    const createUser = await cognitoClient.send(
        new AdminCreateUserCommand({
            UserPoolId: USER_POOL,
            Username: email,
            UserAttributes: [
                { Name: 'email', Value: email },
                { Name: 'email_verified', Value: 'true' }
            ],
            TemporaryPassword: password
        })
    );
    // console.log("Create User : ",createUser);
    
    const setPermanentPasswordToUser = await cognitoClient.send(
        new AdminSetUserPasswordCommand({
            UserPoolId: USER_POOL,
            Username: email,
            Password: password,
            Permanent: true
        })
    );
    // console.log("Set PermanentPassword To User : ",setPermanentPasswordToUser);

    if(isStudent === true){

        const addUserToGroup = await cognitoClient.send(
            new AdminAddUserToGroupCommand({
                UserPoolId: USER_POOL,
                Username: email,
                GroupName: STUDENT_GROUP
            })
        );
        // console.log("Add User To Group : ",addUserToGroup);  
    }else{

        const addUserToGroup = await cognitoClient.send(
            new AdminAddUserToGroupCommand({
                UserPoolId: USER_POOL,
                Username: email,
                GroupName: FACULTY_GROUP
            })
        );
        // console.log("Add User To Group : ",addUserToGroup);  
    }
    
    const userDetails = await getUser({ email:email });
    
    return userDetails;
}

export const deleteCognitoUser = async ({ userName }) => {
    
    return await cognitoClient.send(
        new AdminDeleteUserCommand({
            UserPoolId: USER_POOL,
            Username: userName
        })
    );

}

