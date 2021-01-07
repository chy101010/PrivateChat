const user = require('../model/user');
const bcryct = require('bcryptjs');

// create a new user in the database 
const submitRegistration = async function (req, res) {
    const { username, password: plainTextPassword } = req.body
    const password = await bcryct.hash(plainTextPassword, 10);

    // can do some password and username valid checkign here 

    try {
        const result = await user.createUser(username, password);
    } catch (error) {
        // successful
        if (error.code === 11000) {
            return res.json({ status: 'error', error: 'Username already in use' });
        }
        throw error;
    }
    res.json({ status: 'ok' })
}

exports.submitRegistration = submitRegistration;