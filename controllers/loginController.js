const Register = require('../models/registerModel');

exports.postLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await Register.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'Email not found' });
        }

        if (user.password !== password) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        const { employeeID } = user;

        res.status(200).json({
            message: `Login successful ${email}`,
            data: {
                email,
                password,
                employeeID
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
