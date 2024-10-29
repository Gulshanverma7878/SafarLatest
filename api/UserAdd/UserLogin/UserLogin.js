const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // Use bcrypt to compare hashed passwords
const User = require("../UserModel");
const { Op } = require('sequelize');

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const user = await User.findOne({
            where: { email, status: { [Op.ne]: "Inactive" } }
        });

        if (!user) {
            return res.status(400).json({ error: 'User not found or inactive' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id, role: user.role }, 'Gulshan', { expiresIn: '1d' });

        res.status(200).json({ userid: user.id, token, role: user.role, username: user.name });

    } catch (error) {
        console.error('Login error:', error.message);
        res.status(500).json({ error: 'Failed to login' });
    }
};
