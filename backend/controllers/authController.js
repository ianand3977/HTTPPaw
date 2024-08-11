const axios = require('axios');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Assuming you have a User model

exports.googleLogin = async (req, res) => {
    console.log("Google login process started."); // Log start of process

    try {
        const { token } = req.body;
        console.log("Received token from client:", token);

        // Validate Google token
        const response = await axios.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${token}`);
        console.log("Response from Google token verification:", response.data);

        const { email, name, picture, sub: googleId } = response.data;
        console.log("Extracted user info from Google response:", { email, name, picture, googleId });

        // Check if user already exists
        let user = await User.findOne({ email });
        if (!user) {
            console.log("User not found in database. Creating a new user.");
            // Create a new user with isVerified and isOAuthUser set to true
            user = new User({
                name,
                email,
                googleId,
                avatar: picture,
                isVerified: true,
                isOAuthUser: true,
            });
            await user.save();
            console.log("New user created and saved to database:", user);
        } else {
            console.log("User found in database:", user);

            // Ensure isVerified and isOAuthUser are set correctly
            if (!user.isVerified || !user.isOAuthUser) {
                user.isVerified = true;
                user.isOAuthUser = true;
                await user.save();
                console.log("Existing user updated with isVerified and isOAuthUser set to true:", user);
            }
        }

        // Generate JWT token
        const jwtToken = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        console.log("Generated JWT token for user:", jwtToken);

        // Send response
        res.status(200).json({
            token: jwtToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar
            }
        });
        console.log("Google login process completed successfully.");

    } catch (error) {
        console.error("Error during Google login:", error.message);
        if (error.response) {
            console.error("Google API response error:", error.response.data);
        }
        res.status(500).json({ message: "Google login failed", error: error.message });
    }
};
