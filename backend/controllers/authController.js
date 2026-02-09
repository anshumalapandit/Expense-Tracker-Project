const User=require("../models/User")
const jwt = require("jsonwebtoken");



// Generate JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// Register User
exports.registerUser = async (req, res) => {
     console.log("Incoming body:", req.body); // ✅
    const { fullName, email, password, profileImageUrl } = req.body;
    console.log("Incoming body:", req.body);


    // Validation: Check for missing fields
    if (!fullName || !email || !password) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    try {
        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "Email already in use"
            });
        }

        // Create the user
        const user = await User.create({
            fullName,
            email,
            password,
            profileImageUrl,
        });

        res.status(201).json({
            id: user._id,
            user,
            token:generateToken(user._id),
        });

    } catch (err) {
        
      //  console.error("Registration error:", err.message);
        res.status(500).json({
            message: "Server error during registration",error:err.message
        });
    }
};

// Login User
// Login User
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    console.log("Request received:", req.body); // Check if request reaches the server
    // Validation: Check for missing fields
    if (!email || !password) {
        return res.status(400).json({ 
            message: "All fields are required" 
        });
    }

    try {
        // Check if user exists
        const user = await User.findOne({ email });
        
        // Verify password
        if (!user || !(await user.comparePassword(password))) {
            return res.status(400).json({ 
                message: "Invalid credentials" 
            });
        }

        // Successful login
        res.status(200).json({
            id: user._id,
            user,
            token: generateToken(user._id)
        });

    } catch (err) {
        res.status(500).json({ 
            message: "Error logging in user", 
            error: err.message 
        });
    }
};

// Get User Info
// Get User Info
exports.getUserInfo = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        
        if (!user) {
            return res.status(404).json({ 
                message: "User not found" 
            });
        }

        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ 
            message: "Error fetching user", 
            error: err.message 
        });
    }
};