import User from "../models/user.model.js";

const createUser = async (req, res) => {
  const { body } = req;

  if (!body.phoneNumber) {
    return res.status(400).json({ message: "Phone number is required" });
  }

  try {
    const user = new User({ phoneNumber: body.phoneNumber });
    await user.save();
    return res.status(201).json(user);
  } catch (error) {
    return res.status(500).json({ message: "Error creating user" });
  }
};

export { createUser };
