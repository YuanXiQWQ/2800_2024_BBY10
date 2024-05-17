import bcrypt from 'bcrypt';
import {findByUsername, validatePassword} from '../model/user.js';
import {User} from '../model/user.js';


export async function register(req, res) {

    const saltRounds = 10;

    try {
        const {username, firstName, lastName, email, birthday, password} = req.body;
        const hashedPassword = await bcrypt.hash(password, saltRounds);



        req.session.userData = {
            username,
            firstName,
            lastName,
            email,
            password: hashedPassword,
            birthday
        };


        res.redirect('/additional-info');
    } catch (error) {
        console.error('Error hashing password:', error);
        res.status(500).send('Internal Server Error');
    }
}

export async function AdditionalUserInfo(req, res) {
    const {weight, height, time, goal, fitnessLevel} = req.body;
    const {username, firstName, lastName, email, birthday, password: hashedPassword} = req.session.userData;

    req.session.userData = {
        ...req.session.userData,
        weight,
        height,
        time,
        goal,
        fitnessLevel
    };

    const newUser = new User({
        username,
        firstName,
        lastName,
        email,
        password: hashedPassword,
        birthday,
        weight,
        height,
        fitnessLevel,
        time,
        goal
    });

    console.log(newUser);

    try {
        await newUser.save();
        res.redirect("/profile");
    } catch (error) {
        console.error('Error saving new user:', error);
        res.status(500).send('Internal Server Error');
    }
}

export function login() {

}

export async function changePassword(req, res) {
    const {oldPassword, newPassword} = req.body;

    try {
        const user = await findByUsername(req.session.username);
        if (!user) {
            return res.status(404).json({message: 'User not found'});
        }

        const isMatch = await validatePassword(oldPassword);
        if (!isMatch) {
            return res.status(400).json({message: 'Old password is incorrect'});
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.status(200).json({message: 'Password changed successfully'});
    } catch (error) {
        res.status(500).json({message: 'Server error', error});
    }
}

export async function postPersonalInformation(req, res) {
    const {name, email, birthday, height, weight} = req.body;

    try {
        const user = await User.findById(req.session.userId);
        if (!user) {
            return res.status(404).json({success: false, message: 'User not found'});
        }

        user.name = name;
        user.email = email;
        user.birthday = birthday;
        user.height = height;
        user.weight = weight;

        await user.save();

        req.session.userData = {
            ...req.session.userData,
            name,
            email,
            birthday,
            height,
            weight
        };

        res.status(200).json({success: true, message: 'Personal information updated successfully'});
    } catch (error) {
        res.status(500).json({success: false, message: 'Server error', error});
    }
}