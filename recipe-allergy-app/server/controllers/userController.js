import User from "../models/userModel.js";

export const register = async (req, res) => {
  try {
    const { fitsName, lastName, email, password, allergies } =
      req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    const user = await User.create({
      fitsName,
      lastName,
      email,
      password,
      allergies,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
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
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
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


export const getUser = async(req, res) => {
  try {
    const user = await User.findById(req.user.id)
    if (!user) {
      return res.status(404).json({ message: 'משתמש לא נמצא' });
    }
    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'שגיאה בקבלת פרטי המשתמש' });
  }
}
