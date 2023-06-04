const { User } = require("../models/user");
const HttpError = require("../helper/HttpError");
const ctrlWrapper = require("../decorators/ctrlWrapper");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs/promises");

const Jimp = require("jimp");

const { SECRET_KEY } = process.env;

// register
const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw HttpError(409, "Email already use");
  }

  const hashPasword = await bcrypt.hash(password, 10);
  // avatar
  const avatarURL = gravatar.url(email);

  const newUser = await User.create({
    ...req.body,
    password: hashPasword,
    avatarURL,
  });

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
  });
};
// login
const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw HttpError(401, "Email or password  ivalide");
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password  ivalide");
  }

  // token
  const payload = { id: user._id };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });

  await User.findByIdAndUpdate(user._id, { token });

  res.json({
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
};

// getCurrent

const getCurrent = async (req, res) => {
  const { name, email } = req.user;
  res.json({
    name,
    email,
  });
};

// logout

const logout = async (req, res) => {
  const { _id } = req.user;

  await User.findByIdAndUpdate(_id, { token: "" });

  res.json({ message: "Logout success" });
};
// updateSubscription
const updateSubscription = async (req, res) => {
  const { _id } = req.user;
  const result = await User.findByIdAndUpdate(_id, req.body, { new: true });
  if (!result) {
    throw HttpError(404, ` User with id '${_id}' not found.`);
  }
  res.json(result);
};

// UPDATE AVATAR
const avatarsDir = path.join(__dirname, "../", "public", "avatars");

const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path: tempUpload, originalname } = req.file;

  // Jimp resize 250x250
  const resizeAvatar= await Jimp.read(tempUpload)
  resizeAvatar.resize(250,250).write(tempUpload)

  // rename fileName
  const fileName = `${_id}_${originalname}`;
  const resultUpload = path.join(avatarsDir, fileName);
  await fs.rename(tempUpload, resultUpload);
  
  const avatarUrl = path.join("avatars", fileName);
  await User.findByIdAndUpdate(_id, { avatarUrl });

  res.json({ avatarUrl });
};

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  updateSubscription: ctrlWrapper(updateSubscription),
  updateAvatar: ctrlWrapper(updateAvatar),
};
