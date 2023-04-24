require('dotenv').config()
const UserService = require("../services/user.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');


const securePassword = async(password)=>{
    try{
        var hashPassword = await bcrypt.hash(password,10);
        return hashPassword;
    }catch(error){
        console.log(error.message);
    }
};

const generateTokens = payload => {
//    const { id, email } = payload;
    const accessToken = jwt.sign(
    		payload,
    		process.env.ACCESS_TOKEN_SECRET,
    		{
    			expiresIn: '2h'
    		}
    	)

    const refreshToken = jwt.sign(
        payload,
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: '10d'
        }
    )

    return { accessToken, refreshToken }
}

const login = async (req, res, next) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const userservice = new UserService(MongoDB.client);
        const documents = await userservice.findByMail(email);
//        console.log(documents)
        if(!documents.mail_verify){
            return res.send({ message: "please verify email" });
        }
        if(documents){
//            console.log(documents)
            const checkpass = await bcrypt.compare(password, documents.password);
//            console.log(checkpass)
            if (checkpass) {
                data = {
                         "id": documents._id,
                         "email":  documents.email,
                         "role": documents.role,
                       }
                console.log(data)
                const tokens = generateTokens(data)
                await userservice.createToken(documents._id, tokens.refreshToken)

                res.cookie("refreshToken", tokens.refreshToken, {
                    httpOnly: true,
                    secure: false,
                    path: "/",
                    sameSite: "strict",
                });

                return res.send({
                           user: documents,
                           AccessToken: tokens.accessToken,
                });
            } else {
                return res.send({ message: "Email or Password was wrong!" , equal:false})
            }
        }

    }catch(error){
        return next(
            new ApiError(500,`Error retrieving user with email=${req.body.email}`)
        );
    }
};

const logout = async (req, res, next) => {
    try {
        console.log('logout');
        const userService = new UserService(MongoDB.client);
        await userService.createToken(req.params.id,'')
        res.clearCookie("refreshToken");
        res.send({ message: "Successful logout." });
        res.end();
    } catch (error) {
        console.log(error);
    }
};

const refreshToken = async (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return next(
        new ApiError(401, "You're not authenticated.")
    );
    const userService = new UserService(MongoDB.client);
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (error, user) => {
        if (error) return next(
          new ApiError(402, "Token is not valid.")
        );
        const tokens = generateTokens({id:documents._id, email:documents.email })

        await userservice.createToken(documents._id,tokens.refreshToken)
        res.cookie("refreshToken", tokens.refreshToken, {
            httpOnly: true,
            secure: false,
            path: "/",
            sameSite: "strict",
        });
        return res.send({
               user: user,
               AccessToken: tokens.accessToken,
        });
    })
}

const verifyToken = async (req, res, next) => {
    try {
        const authHeader = await req.header('Authorization');
        if(!authHeader) return next(new ApiError(401, "You're not authoticated."));
        const token = authHeader && authHeader.split(' ')[1]
//        console.log(token)
        if(token){
            jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
                if (error) return next(new ApiError(402, "Token is not valid."));
                req.guest = user;
                next();
            });
        }else{
            return next(new ApiError(401, "You're not authoticated."));
        }
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while logging in the user.")
        );
    }
}

const verifyAdmin = async (req, res, next) => {
    console.log(req.guest)
    if (req.guest.role == 1) {
//        console.log(req.guest)
        next();
    } else {
        return next(
            new ApiError(400, "You are not authorized to make this change.")
        );
    }
}

const verifyUser = async (req, res, next) => {
    if (req.guest.id == req.params.id || req.guest.role == 1) {
        next();
    } else {
        return next(
            new ApiError(400, "You are not authorized to make this change.")
        );
    }
}

module.exports = {
    login,
    logout,
    verifyUser,
    verifyAdmin,
    verifyToken,
    refreshToken
}