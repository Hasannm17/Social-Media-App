import jwt from "jsonwebtoken";
import User from "../models/User.js";
import bcrypt from "bcrypt";
/***REGISTER USER  */

export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      picturepath,
      friends,
      location,
      occupation,
    } = req.body;

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      picturepath,
      friends,
      location,
      occupation,
      viewdProfile: Math.floor(Math.random() * 1000),
      impressions: Math.floor(Math.random() * 1000),
    });

    const savedUser = await newUser.save();
    res
      .status(201)
      .json({ message: "Account created successfully", savedUser });
  } catch (error) {
    res.status(500).json({
      message: "There is a problem Creating the user ,please check up ",
      error: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = User.findOne({ email: email }).then(async (user) => {
      if (!user) {
        return res.status(400).json({ message: "User don't exist at all!" });
      } else {
        const isMatch = await bcrypt
          .compare(password, user.password)
          .then(async (isMatch) => {
            if (!isMatch) {
              return res.status(400).json({ message: "Invalid credentials." });
            } else {
              const token = jwt.sign({ id: User._id }, process.env.JWT_SECRET);
            delete user.password ;
              res
                .status(200)
                .json({
                  message: "Logged in successfully",
                  token: token,
                  user: user  ,
                });
            }
          });
      }
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "There is a problem Logging in", error: error.message });
  }
};
