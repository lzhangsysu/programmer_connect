const express = require('express');
const request = require('request');
const config = require('config');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const checkObjectId = require('../../middleware/checkObjectId');

const Profile = require('../../models/Profile');
const User = require('../../models/User');
const Post = require('../../models/Post');

// @route   GET api/profile/me
// @desc    Get current user's profile
// @access  Private
router.get('/me', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ 
            user: req.user.id 
        }).populate(
            'user', 
            ['name', 'avatar']
        );

        if (!profile) {
            return res.status(400).json({ msg: 'Profile not found for this user '});
        }

        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// @route   POST api/profile
// @desc    Create or update user's profile
// @access  Private
router.post(
    '/', 
    auth, 
    check('status', 'Status is required').notEmpty(),
    check('skills', 'Skills is required').notEmpty(),
    
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {
            website,
            skills,
            youtube,
            twitter,
            instagram,
            linkedin,
            facebook,
            ...rest
        } = req.body;

        // Build profile object
        const profileFields = {
            user: req.user.id,
            website,
            skills: Array.isArray(skills) ? skills : skills.split(',').map(skill => ' ' + skill.trim()),
            ...rest
        };
        
        // Build social object
        const socialfields = { youtube, twitter, instagram, linkedin, facebook };

        for (const [key, value] of Object.entries(socialfields)) {
            if (value && value.length > 0) {
                socialfields[key] = value;
            }
            profileFields.social = socialfields;
        }

        try {
            let profile = await Profile.findOneAndUpdate(
                { user: req.user.id },
                { $set: profileFields},
                { new: true, upsert: true }
            );
            
            res.json(profile);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);


// @route   GET api/profile
// @desc    Get all profiles
// @access  Public
router.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar']);
        res.json(profiles);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// @route   GET api/profile/user/:user_id
// @desc    Get profile by user ID
// @access  Public
router.get('/user/:user_id', checkObjectId('user_id'), async (req, res) => {
    try {
        const profile = await Profile.findOne({user: req.params.user_id }).populate('user', ['name', 'avatar']);
        
        if (!profile) 
            return res.status(400).json({ msg: 'Profile not found' });

        res.json(profile);
    } catch (err) {
        console.error(err.message);
        if (err.kind == 'ObjectId') {
            return res.status(400).json({ msg: 'Profile not found' });
        }
        res.status(500).send('Server Error');
    }
});


// @route   DELETE api/profile
// @desc    Delete profile, user & posts
// @access  Private
router.delete('/', auth, async (req, res) => {
    try {
        // Remove user posts
        await Post.deleteMany({ user: req.user.id });
        // Remove profile
        await Profile.findOneAndRemove({ user: req.user.id });
        // Remove user
        await User.findOneAndRemove({ _id: req.user.id });
        
        res.json({ msg: 'User deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// @route   PUT api/profile/experience
// @desc    Add profile experience
// @access  Private
router.put(
    '/experience', 
    auth, 
    check('title', 'Title is required').notEmpty(),
    check('company', 'Company is required').notEmpty(),
     check('from', 'From date is required and must be valid')
        .notEmpty()
        .custom((value, { req }) => req.body.to ? value < req.body.to : true), 
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array( )});
        }

        try {
            const profile = await Profile.findOne({ user: req.user.id });

            profile.experience.unshift(req.body);

            await profile.save();

            res.json(profile);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);


// @route   DELETE api/profile/experience/:exp_id
// @desc    Delete experience from profile
// @access  Private
router.delete('/experience/:exp_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });

        // Filter exprience array using _id
        profile.experience = profile.experience.filter(
            exp => exp._id.toString() !== req.params.exp_id
        );

        await profile.save();
        return res.status(200).json(profile);
    } catch (err) {
        console.err(err.message);
        res.status(500).send('Server Error');
    }
});


// @route   PUT api/profile/education
// @desc    Add profile education
// @access  Private
router.put(
    '/education', 
    auth, 
    check('school', 'School is required').notEmpty(),
    check('degree', 'Degree is required').notEmpty(),
    check('fieldofstudy', 'Field of study is required').notEmpty(),
    check('from', 'From date is required and must be valid')
        .notEmpty()
        .custom((value, { req }) => req.body.to ? value < req.body.to : true), 
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const profile = await Profile.findOne({ user: req.user.id });

            profile.education.unshift(req.body);

            await profile.save();

            res.json(profile);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);


// @route   DELETE api/profile/education/:edu_id
// @desc    Delete education from profile
// @access  Private
router.delete('/education/:edu_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });

        // Filter education array using _id
        profile.education = profile.experience.filter(
            edu => edu._id.toString() !== req.params.edu_id
        );

        await profile.save();
        return res.status(200).json(profile);
    } catch (err) {
        console.err(err.message);
        res.status(500).send('Server Error');
    }
});


// @route   GET api/profile/github/:username
// @desc    Get user repos from Github
// @access  Public
router.get('/github/:username', (req, res) => {
    try {
        const options = {
            uri: encodeURI(`https://api.github.com/users/${
                req.params.username
            }/repos?per_page=5&sort=created:asc&client_id=${config.get(
                'githubClientId'
                )}&client_secret=${config.get('githubSecret')}`),
            method: 'GET',
            headers: { 'user-agent': 'node.js' } 
        };

        request(options, (error, response, body) => {
            if (error) console.error(error);

            if (response.statusCode != 200) {
                return res.status(404).json({ msg: 'No Github profile found' });
            }

            res.json(JSON.parse(body));
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


module.exports = router;