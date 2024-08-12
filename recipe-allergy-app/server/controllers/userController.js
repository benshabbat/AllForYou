import User from "../models/userModel.js";

export const register = async (req, res) => {
  try {
    const { username, fitsName, lastName, email, password, allergies } =
      req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    const user = await User.create({
      username,
      fitsName,
      lastName,
      email,
      password,
      allergies,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        fitsName:user.fitsName,
        lastName:user.lastName,
        email: user.email,
        allergies: user.allergies,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (user && (await user.matchPassword(password))) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        fitsName:user.fitsName,
        lastName:user.lastName,
        email: user.email,
        allergies: user.allergies,
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
