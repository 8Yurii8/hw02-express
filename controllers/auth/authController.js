import { User } from "../../models/user.js";
import HttpError from "../../helper/HttpError.js";
import { ctrlWrapper } from "../../routes/api/decorators/ctrlWrapper.js";
import bcrypt from "bcryptjs";
import "dotenv/config";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import Jimp from "jimp";
import fs from "fs/promises";
import path from "path";
import { nanoid } from "nanoid";
import sendEmail from "../../helper/sendEmail.js";
const { JWT_SECRET, BASE_URL } = process.env;

const AVATARS_PATH = path.join("public", "avatars");

const register = async (req, res) => {
  const { password, email } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const verificationToken = nanoid();
  const avatarURL = gravatar.url(email, { s: "200", r: "pg", d: "mm" });

  if (req.file) {
    const avatar = await Jimp.read(req.file.path);
    await avatar.resize(250, 250);

    const fileName = `${Date.now()}-${req.file.originalname}`;
    const newPath = path.join(AVATARS_PATH, fileName);

    await avatar.writeAsync(newPath);
    req.file.path = newPath;
  }

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL: req.file
      ? `/avatars/${path.basename(req.file.path)}`
      : avatarURL,
    verificationToken,
  });
  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a href="${BASE_URL}/api/user/verify/${verificationToken}" target="_blank">Click Verify email</a>`,
  };
  await sendEmail(verifyEmail);
  res.status(201).json({
    name: newUser.name,
    email: newUser.email,
    avatarURL: newUser.avatarURL,
  });
};
const login = async (req, res) => {
  const { password, email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }
  if (!user.verify) {
    throw HttpError(404, "User not found");
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }
  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });
  await User.findByIdAndUpdate(user._id, { token });
  res.json({ token });
};
const verify = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });
  if (!user) {
    throw HttpError(404, "User not found");
  }
  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: "null",
  });
  res.json({ message: "Verification successful" });
};
const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user.email) {
    throw HttpError(400, "missing required field email");
  }
  if (user.verify) {
    throw HttpError(400, "Verification has already been passed");
  }
  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a href="${BASE_URL}/api/user/verify/${user.verificationToken}" target="_blank">Click Verify email</a>`,
  };
  await sendEmail(verifyEmail);
  res.json({ message: "Verification email sent" });
};
const getCurren = (req, res) => {
  const { email, subscription } = req.user;
  res.json({ email, subscription });
};

const signout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });
  res.status(204).json({
    message: "No Content",
  });
};
const updateSubscription = async (req, res) => {
  const { _id } = req.user;
  const result = await User.findByIdAndUpdate(_id, req.body, { new: true });
  if (!result) {
    throw HttpError(404, { message: "Not found" });
  }
  res.json("update successfully");
};
const updateAvatar = async (req, res) => {
  const { _id } = req.user;

  if (!req.file) {
    throw HttpError(400, "Avatar file missing");
  }

  const avatar = await Jimp.read(req.file.path);
  await avatar.resize(250, 250);

  const fileName = `${Date.now()}-${req.file.originalname}`;
  const newPath = path.join(AVATARS_PATH, fileName);

  await avatar.writeAsync(newPath);
  req.file.path = newPath;

  try {
    const userAvatar = await User.findById(_id).select("avatarURL");

    if (userAvatar.avatarURL) {
      const avatarPath = path.join(
        AVATARS_PATH,
        path.basename(userAvatar.avatarURL)
      );
      await fs.unlink(avatarPath);
    }

    await User.findByIdAndUpdate(_id, { avatarURL: `/avatars/${fileName}` });
  } catch (error) {
    throw HttpError(500, "Avatar update failed");
  }

  const updatedUser = await User.findById(_id).select("avatarURL");

  res.status(200).json({ avatarURL: updatedUser.avatarURL });
};

export default {
  register: ctrlWrapper(register),
  verify: ctrlWrapper(verify),
  resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
  login: ctrlWrapper(login),
  getCurren: ctrlWrapper(getCurren),
  signout: ctrlWrapper(signout),
  updateSubscription: ctrlWrapper(updateSubscription),
  updateAvatar: ctrlWrapper(updateAvatar),
};
