const User = require('../models/user.model');

const roleMiddleware = (role) => {

    return async (req,res,next) => {

        try {

            const user = await User.findById(req.user.id);

            if(user.role !== role) {

                return res.status(403).json({
                    success: false,
                    message: "Access denied"
                });

            }

            next();

        } catch(error) {

            return res.status(500).json({
                success: false,
                message: error.message
            });

        }

    };

};

module.exports = roleMiddleware;