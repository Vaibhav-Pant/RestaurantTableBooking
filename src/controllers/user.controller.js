import {User} from "../models/user.model.js"

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        console.log("Error: ", error);
        return {};
    }
};

const loginUser = async (req, res) => {

    const { email, password } = req.body;

    if (!email){
        return res
        .status(400)
        .json("Email is required.")
    }

    const user = await User.findOne({email});

    if (!user){
        return res
        .status(400)
        .json("User does not exist.")
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid){
        return res
        .status(400)
        .json("Invalid user credentials.")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

    if(!accessToken || !refreshToken) return res.status(500).json("Something went wrong. Try again.");

    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    // Add to cookies
    const options = {
        maxAge: 3 * 60 * 60 * 1000, // In milli second
        httpOnly: true,
        secure: true,
        sameSite: "None",
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json({
            user: loggedInUser,
            accessToken,
            refreshToken
        })
};

const registerUser = async (req, res) => {

    const { email, username, password } = req.body;

    if (
        [email, username, password].some(
            (field) => field?.trim() === ""
        )
    ) {
        return res
        .status(400)
        .json("All field are required!");
    }

    const checkEmailExist = await User.findOne({
        email: email
    });

    const UsernameExist = await User.findOne({
        username: username
    });

    if (checkEmailExist) {
        return res
        .status(409)
        .json("Email already exist.");
    }

    if (UsernameExist) {
        return res
        .status(409)
        .json("Username already taken.");
    }

    const user = await User.create({
        username: username,
        email,
        password,
    });

    // Do not give password and refrsh token as responce
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    if (!createdUser) {
        return res
        .status(500)          
        .json("Something went wrong while registering the user.")
    }

    return res
        .status(200)
        .json(createdUser);
};

const logoutUser = async (req, res) => {

    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1,
            },
        },
        {
            new: true,
        }
    );

    const options = {
        htpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json("User Logout succesfully.");
};

export {
    loginUser,
    logoutUser,
    registerUser
}