const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require("../Models/Users");

const signup = async (req, res) => {
    try {
        const {name, email, password, userType} = req.body;
        const user = await UserModel.findOne({email});
        if (user) {
            return res.status(409)
                .json({message: 'User already exists, you can login', success: false})
        }
        const userModel = new UserModel({name, email, password, userType});
        userModel.password = await bcrypt.hash(password, 10);
        await userModel.save();
        res.status(201)
            .json({
                message: "Signup successfully",
                success: true
            })
    } catch (err) {
        res.status(500)
            .json({
                message: "Internal server error",
                success: false
            })
    }
}

const login = async (req, res) => {
    try {
        const {email, password, userType} = req.body;
        const user = await UserModel.findOne({email});
        const errorMsg = 'Auth failed: email, password, or user type is incorrect';
        
        if (!user || user.userType !== userType) {
            return res.status(403)
                .json({message: errorMsg, success: false})
        }
        
        const isPassEqual = await bcrypt.compare(password, user.password);
        if (!isPassEqual) {
            return res.status(403)
                .json({message: errorMsg, success: false});
        }
        
        const jwtToken = jwt.sign(
            {
                email: user.email,
                _id: user._id,
                userType: user.userType
            },
            process.env.JWT_SECRET,
            {expiresIn: '12h'}
        )
        
        res.status(200)
            .json({
                message: "Login success",
                success: true,
                jwtToken,
                email,
                name: user.name,
                userType: user.userType
            })
    } catch (err) {
        res.status(500)
            .json({
                message: "Internal server error",
                success: false
            })
    }
}

module.exports = {
    signup,
    login
}