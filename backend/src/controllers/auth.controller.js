const bcrypt = require('bcryptjs'); 
const User = require('../models/user.model');
const Mess = require('../models/mess.model');
const Resident = require('../models/resident.model');
const jwt = require('jsonwebtoken');

exports.signup = async (req,res) => {
    try {
        const { name, email, password, role, messName, address, upiId, ownerPhone, monthlyPrice, joinCode } = req.body;

        const existingUser = await User.findOne({ email });
        if(existingUser) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        // If Resident, verify Join Code first
        let targetMess = null;
        if (role === 'RESIDENT') {
            if (!joinCode) return res.status(400).json({ success: false, message: "Mess join code is required" });
            targetMess = await Mess.findOne({ joinCode: joinCode.trim().toUpperCase() });
            if (!targetMess) return res.status(404).json({ success: false, message: "Invalid Mess join code" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role
        });

        // Handle Role-Specific Linking
        if (role === 'OWNER') {
            const newJoinCode = Math.random().toString(36).substring(2, 8).toUpperCase();
            await Mess.create({
                messName: messName || `${name}'s Mess`,
                address: address || 'Not Provided',
                upiId: upiId || 'notset@upi',
                ownerPhone: ownerPhone || '0000000000',
                monthlyPrice: monthlyPrice || 2800,
                joinCode: newJoinCode,
                owner: user._id
            });
        } else if (role === 'RESIDENT' && targetMess) {
            await Resident.create({
                user: user._id,
                mess: targetMess._id,
                planType: 'FULL',
                mealsRemaining: 0 // Start with 0, owner will recharge
            });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.status(201).json({
            success: true,
            message: "User registered and linked successfully",
            token,
            user
        });

    } catch(error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.login = async (req,res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if(!user) return res.status(404).json({ success: false, message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(400).json({ success: false, message: "Invalid credentials" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user
        });
    } catch(error) {
        res.status(500).json({ success: false, message: error.message });
    }
};