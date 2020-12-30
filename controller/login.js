const user = require('../model/user');
const bcryct = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const submitLogin = async function (req, res) {
    const { username, password } = req.body;
    // can do some password and username valid checkign here 
    try {
        const result = await user.findUser(username);
        if (!user) {
            return res.json({ status: 'error', error: 'Invalid Username' });
        }
        if (await bcryct.compare(password, result.password)) {
            const token = jwt.sign(
                {
                    username: username
                },
                process.env.ACCESS_TOKEN_SECRET
            )
            return res.json({ status: 'ok', token: token });
        }
        res.json({ status: 'error', error: 'Invalid Password' });
    } catch (error) {
        console.log("error");
        res.json({ status: 'error', error: 'Invalid Username/Password' });
    }
}

exports.submitLogin = submitLogin;