import {findByUsername, validatePassword} from "./auth.js";

/**
 * Function to log in the user.
 * Checks if the user exists and validates the password.
 * If successful, store user data in the session.
 *
 * @param {Request} req - Express request object containing the username and password in the body
 * @param {Response} res - Express response object
 * @returns {Promise<void>} A promise that resolves when the login is complete
 */
export async function logIn(req, res) {
    const {username, password} = req.body;
    try {
        const user = await findByUsername(username);
        if (!user) return res.status(404).json({message: "User not found", success: false});
        const isMatch = await validatePassword(user, password);
        if (!isMatch) return res.status(400).json({message: "Invalid password", success: false});
        req.session.userData = user;
        res.status(200).json({success: true});
    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({message: "Internal Server Error", success: false});
    }
}
