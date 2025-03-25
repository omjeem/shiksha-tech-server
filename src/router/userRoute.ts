import Express, { Request, Response } from 'express';
import { UserValidator } from '../validator/userValidator';
import { validateRequest } from '../middleware/zodValidator';

const userRouter = Express.Router();

userRouter.post(
    '/',
    validateRequest(UserValidator.registerUserValidator),
    (req: Request, res: Response): any => {
        const body = req.body;
        console.log('Register User Route', body);
        return res.json({
            message: 'User registered successfully',
        });
        /* 
     #swagger.tags = ['User']
     #swagger.summary = 'Register a new user'
     #swagger.description = 'Register a new user with name, email, and password'
    
     #swagger.requestBody = {
        required: true,
        schema: { $ref: '#/components/schemas/RegisterUserRequest' },
         example: {
                name: "John Doe",
                email: "john.doe@example.com",
                password: "securePassword123"
            }
    } 
    
    #swagger.parameters['body'] = {
        in: 'body',
        description: 'User data.',
        required: true,
        schema: {
            username: "user",
            password: "1234"
        }
    } 
    
    /* #swagger.responses[200] = {
    description: "User registered successfully",
    content: {
        "application/json": {
            schema: {
                type: "object",
                properties: {
                    message: { type: "string" },
                    data: {
                        type: "object",
                        properties: {
                            id: { type: "integer" },
                            name: { type: "string" },
                            email: { type: "string" }
                        }
                    }
                }
            },
            examples: {
                "Standard User": {
                    value: {
                        message: "User registered successfully",
                        data: {
                            id: 1,
                            name: "John Doe",
                            email: "john@example.com"
                        }
                    }
                },
                "New User": {
                    value: {
                        message: "New User registered successfully",
                        data: {
                            id: 2,
                            name: "Jane Doe",
                            email: "jane@example.com"
                        }
                    }
                }
            }
        }
    }
    } 
     
    */
    },
);

userRouter.put(
    '/',
    validateRequest(UserValidator.loginUserValidator),
    (req: Request, res: Response): any => {
        // #swagger.tags = ['User']
        // #swagger.summary = 'Login a user'
        // #swagger.description = 'Login with email and password'

        /* #swagger.requestBody = {
            required: true,
            schema: { $ref: '#/components/schemas/LoginUserRequest' }
        } */

        /* #swagger.responses[200] = {
            description: 'User logged in successfully',
            schema: { 
                message: 'User logged in successfully',
                token: 'jwt-token-here',
                user: {
                    id: 1,
                    name: 'John Doe',
                    email: 'john@example.com'
                }
            }
        } */

        const body = req.body;
        console.log('Login User Route', body);
        return res.json({
            message: 'User Loggedin successfully',
        });
    },
);

export default userRouter;
