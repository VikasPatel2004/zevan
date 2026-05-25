const bcrypt = require('bcryptjs'); 
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

exports.signup = async (req,res) => {

    try {

        const { name, email, password, role } = req.body;

        const existingUser = await User.findOne({ email });

        if(existingUser) {

            return res.status(400).json({
                success: false,
                message: "User already exists"
            });

        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role
        });

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            token,
            user
        });

    } catch(error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};