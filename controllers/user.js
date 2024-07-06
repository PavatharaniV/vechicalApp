const User = require('../models/user');
const jwt = require('jsonwebtoken');

exports.createUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const isNewUser = await User.isThisEmailInUse(email);

        if (!isNewUser) {
            return res.json({
                success: false,
                message: 'This email is already in use'
            });
        }

        const user = new User({ name, email, password });

        await user.save();

        res.json({ success: true, user });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

exports.userSignIn = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        console.log();
        if (!user) {
            return res.json({ success: false, message: 'User not found with the given email!' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.json({ success: false, message: 'Email/password does not match' });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        let oldTokens = user.tokens || [];

        oldTokens = oldTokens.filter(t => {
            const timeDiff = (Date.now() - parseInt(t.signedAt)) / 1000;
            return timeDiff < 86400;
        });

        await User.findByIdAndUpdate(user._id, { tokens: [...oldTokens, { token, signedAt: Date.now().toString() }] });

        const userInfo = {
            name: user.name,
            email: user.email
        }

        res.json({ success: true, user: userInfo, token });
    } catch (error) {
        console.error('Error signing in user:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

exports.signOut = async (req, res) => {
    if (req.headers && req.headers.authorization) {
        const token = req.headers.authorization.split(' ')[1]
        if (!token) {
            return res
                .status(401)
                .json({
                    success: false,
                    message: 'Authorization fail!'
                });
        }

        const tokens = req.user.tokens

        const newTokens = tokens.filter(t => t.token !== token)

        await User.findByIdAndUpdate(req.user._id, {
            tokens: newTokens
        })

        res.json({ success: true, message: 'Sign out successfully' })
    }
}

exports.profile = async (req, res) => {
    if (!req.user) {
        return res.json({ success: false, message: 'Unauthorized access!' });
    }

    try {
        const userProfile = await User.findById(req.user._id);
        if (!userProfile) {
            return res.json({ success: false, message: 'User not found!' });
        }

        //console.log("userProfile",userProfile);
        res.json({
            success: true,
            profile: {
                userId: userProfile._id,
                name: userProfile.name,
                email: userProfile.email,
            }
        });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }

}
