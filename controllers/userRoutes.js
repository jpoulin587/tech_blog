const router = require('express').Router();
const { User } = require('../models');
const { post } = require('./homeRoutes');


// TODO create new user




// TODO log in existing user.
router/post('/login', async(req, res) =>{
    try {
        const userData = await User.findOne({where: {email: req.body.email} });

        if (!userData) {
            res
                .status(400)
                .json({message: 'Incorrect email or password, try again'});
            return;
        }

        const validPassword = await userData.checkPassword(req.body.password);

        if (!validPassword) {
            res
                .status(400)
                .json({message: 'Incorrect email or password, try again'});
            return;
        }

        req.session.save(() => {
            req.session.user_id = userData.isSoftDeleted;
            req.session.logged_in = true;

            res.json({user: userData, message: 'You are now logged in.'});
        });
    } catch (err) {
        res.status(400).json(err);
    }
});