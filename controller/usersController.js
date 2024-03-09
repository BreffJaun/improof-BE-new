// I M P O R T:  E X T E R N A L  D E P E N D E N C I E S
// import * as dotenv from "dotenv";
// dotenv.config();
// import sgMail from "@sendgrid/mail";
import * as url from "url";
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));
import { v2 as cloudinary } from "cloudinary";
import { unlink } from "fs/promises";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// I M P O R T:  F U N C T I O N S
import UserModel from "../models/userModel.js";
import NotificationModel from "../models/notificationModel.js";
import ProjectModel from "../models/projectModel.js";
import MessageModel from "../models/messageModel.js";
import { sendMail } from "../services/nodeMailer/nodeMailerConfig.js";

// I M P O R T:  E N V  O P T I O N S
import {
  JWT_KEY,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_CLOUD_NAME,
  FE_HOST,
  cookieAge,
} from "../config/config.js";

//========================

//  L E G E N D
//  (N) = CONTROLLER WITH A NOTIFICATION

// ALL USERS (GET) ✅
export const getUsers = async (req, res, next) => {
  try {
    res.json(await UserModel.find());
  } catch (err) {
    next(err);
  }
};

// ADD USER (POST) (N)
export const addUser = async (req, res, next) => {
  try {
    // N E W //
    const kof = "registration"; // kof => "kind of function"
    let createdUser;
    // let newCreatedUser;
    const newUser = req.body;
    const hashedPassword = await bcrypt.hash(newUser.profile.password, 10);
    const initials =
      newUser.profile.firstName[0].toUpperCase() +
      newUser.profile.lastName[0].toUpperCase();

    if (newUser.profile.isTalent) {
      createdUser = await UserModel.create({
        ...newUser,
        profile: {
          ...newUser.profile,
          password: hashedPassword,
          isTalent: true,
          initials: initials,
        },
        meta: { colorTheme: ["c-DB2", "bg-gDB"] },
      });
      // newCreatedUser = createdUser;
      const userId = createdUser._id;
      // CREATE NOTIFICATION TO INFORM THE USER START //
      const newNotification = await NotificationModel.create({
        receiver: userId,
        notText: `Fill out your profile and get easily discovered by recruiters and other talents!`,
      });
      const updatedUser = await UserModel.findByIdAndUpdate(userId, {
        $push: { notifications: newNotification._id },
      });
      // CREATE NOTIFICATION TO INFORM THE USER END //
    }
    if (newUser.profile.isRecruiter) {
      createdUser = await UserModel.create({
        ...newUser,
        profile: {
          ...newUser.profile,
          password: hashedPassword,
          isRecruiter: true,
          initials: initials,
        },
        meta: { colorTheme: ["c-GR1", "bg-gGR1"] },
      });
      // newCreatedUser = createdUser;
      const userId = createdUser._id;
      // CREATE NOTIFICATION FOR TO INFORM THE USER START //
      const newNotification = await NotificationModel.create({
        receiver: userId,
        notText: `Fill out your profile to give Talents a better impression!`,
      });
      const updatedUser = await UserModel.findByIdAndUpdate(userId, {
        $push: { notifications: newNotification._id },
      });
      // CREATE NOTIFICATION FOR TO INFORM THE USER END //
    }

    // VERIFY EMAIL IMPLEMENT BEGIN //
    await sendMail(createdUser, kof);
    // VERIFY EMAIL IMPLEMENT END //

    // O L D //

    // let newCreatedUser;
    // const newUser = req.body;
    // // in the UserModel we check if the given email-address is unique
    // const hashedPassword = await bcrypt.hash(newUser.profile.password, 10);
    // const initials =
    //   newUser.profile.firstName[0].toUpperCase() +
    //   newUser.profile.lastName[0].toUpperCase();
    // let createdUser;

    // if (newUser.profile.isTalent) {
    //   // newUser.meta = ["c-DB2","bg-gDB"]
    //   createdUser = await UserModel.create({
    //     ...newUser,
    //     profile: {
    //       ...newUser.profile,
    //       password: hashedPassword,
    //       isTalent: true,
    //       initials: initials,
    //     },
    //     meta: { colorTheme: ["c-DB2", "bg-gDB"] },
    //   });
    //   newCreatedUser = createdUser;
    //   const userId = newCreatedUser._id;
    //   // CREATE NOTIFICATION FOR TO INFORM THE USER START //
    //   const newNotification = await NotificationModel.create({
    //     receiver: userId,
    //     notText: `Fill out your profile and get easily discovered by recruiters and other talents!`,
    //   });
    //   const updatedUser = await UserModel.findByIdAndUpdate(userId, {
    //     $push: { notifications: newNotification._id },
    //   });
    //   // CREATE NOTIFICATION FOR TO INFORM THE USER END //
    // }
    // if (newUser.profile.isRecruiter) {
    //   createdUser = await UserModel.create({
    //     ...newUser,
    //     profile: {
    //       ...newUser.profile,
    //       password: hashedPassword,
    //       isRecruiter: true,
    //       initials: initials,
    //     },
    //     meta: { colorTheme: ["c-GR1", "bg-gGR1"] },
    //   });
    //   newCreatedUser = createdUser;
    //   const userId = newCreatedUser._id;
    //   // CREATE NOTIFICATION FOR TO INFORM THE USER START //
    //   const newNotification = await NotificationModel.create({
    //     receiver: userId,
    //     notText: `Fill out your profile to give Talents a better impression!`,
    //   });
    //   const updatedUser = await UserModel.findByIdAndUpdate(userId, {
    //     $push: { notifications: newNotification._id },
    //   });
    //   // CREATE NOTIFICATION FOR TO INFORM THE USER END //
    // }

    // VERIFY EMAIL IMPLEMENT BEGIN //
    // sgMail.setApiKey(SENDGRID_KEY);
    // const verifyToken = jwt.sign(
    //   {
    //     email: newUser.email,
    //     _id: newCreatedUser._id,
    //   },
    //   JWT_KEY,
    //   { expiresIn: "1h" }
    // );
    // const msg = {
    //   to: newUser.profile.email, // Change to your recipient
    //   from: SENDGRID_EMAIL, // Change to your verified sender
    //   subject: "VERIFICATION of your 'improof' account",
    //   // text: `To verify your email, please click on this link: http://localhost:2404/users/verify/${verifyToken}`,
    //   html: `
    //   <div>
    //   <p>Hi ${newUser.profile.firstName}, </p>

    //   <p>We're happy you signed up for 'improof'. To start your journey and explore
    //   new projects, please verify your email.</p>

    //   <p style="background-color: orange; border-radius: 7px; width: 80px; height: 20px; text-decoration: none;">
    //   <a href="https://improof.info/api/users/verify/${verifyToken}">
    //   Verify now</a></p>

    //   <p>Welcome to improof!<br>
    //   Your 'improof' Team </p>

    //   <div>`,
    // };
    // const response = await sgMail.send(msg);
    // VERIFY EMAIL IMPLEMENT END //

    res.status(201).json({
      message:
        "Please verify your account via the link in your email, to use your Profile.",
      status: true,
      data: "",
    });
  } catch (err) {
    next(err);
  }
};

// VERIFY EMAIL FOR USER ACCOUNT (GET)
export async function verifyEmail(req, res, next) {
  try {
    const { token } = req.params;
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, JWT_KEY);
    } catch (error) {
      return res.status(400).json({ message: "Invalid or expired token." });
    }
    const id = decodedToken._id;
    const searchedUser = await UserModel.findById(id);
    const updatedUser = await UserModel.findByIdAndUpdate(id, {
      meta: { ...searchedUser.meta, isVerified: true },
    });
    res.redirect(`https://improof.info`);
    // if we have a frontend, we can direct the successful verification to the login page
  } catch (err) {
    next(err);
  }
}

// LOGIN (POST)
export async function login(req, res, next) {
  try {
    const userData = req.body;
    const userFromDb = await UserModel.findOne({
      "profile.email": userData.profile.email,
    });
    const id = userFromDb._id;
    const isVerified = userFromDb.meta.isVerified;
    const loginCount = userFromDb.meta.loginCount;
    let updatedUser;
    if (!isVerified) {
      const err = new Error(
        "User is not verified, please get verified by using the link in your email. If the link is expired please request a new one."
      );
      err.statusCode = 401;
      throw err;
    }
    const checkPassword = await bcrypt.compare(
      userData.profile.password,
      userFromDb.profile.password
    );
    if (!checkPassword) {
      const err = new Error("Invalid password!");
      err.statusCode = 401;
      throw err;
    }

    // FIRST LOGIN CHECK START //
    updatedUser = await UserModel.findByIdAndUpdate(id, {
      meta: { ...userFromDb.meta, loginCount: loginCount + 1 },
    });
    if (loginCount === 1) {
      updatedUser = await UserModel.findByIdAndUpdate(id, {
        meta: {
          ...updatedUser.meta,
          loginCount: loginCount + 1,
          firstLogin: false,
        },
        // FILL IN A NOTIFICATION
      });
    }
    // FIRST LOGIN CHECK END //

    const token = jwt.sign(
      {
        email: userFromDb.profile.email,
        userId: userFromDb._id,
      },
      JWT_KEY,
      { expiresIn: "1d" }
    );

    // INSERT COOKIE CODE START //
    res
      .cookie("loginCookie", token, {
        maxAge: cookieAge.oneHour,
        httpOnly: true,
        sameSite: "none",
        secure: true,
      })
      .json({
        auth: "loggedin",
        email: userFromDb.profile.email,
        userId: userFromDb._id,
        message: "Login SUCCESSFULL!",
        status: true,
        data: "",
      });
    // INSERT COOKIE CODE BEGIN //
  } catch (err) {
    next(err);
  }
}

// CHECK IF ALREADY LOGGED IN (AND IF TOKEN IS STILL VALID) (GET)
export async function checkLogin(req, res, next) {
  try {
    const token = req.cookies.loginCookie;
    const tokenDecoded = jwt.verify(token, JWT_KEY);
    const user = await UserModel.findById(tokenDecoded.userId)
      .populate([
        "starProjects",
        "myProjects",
        "notifications",
        "conversations",
        "follows",
      ])
      .populate([
        {
          path: "myProjects",
          populate: {
            path: "team",
            model: UserModel,
          },
        },
        {
          path: "starProjects",
          populate: {
            path: "team",
            model: UserModel,
          },
        },
        {
          path: "conversations",
          populate: {
            path: "message",
            model: MessageModel,
          },
        },
        {
          path: "conversations",
          populate: {
            path: "participants",
            model: UserModel,
          },
        },
      ]);

    console.log("Token in Cookie is valid. User is loggedin");
    res
      .status(200)
      .json({
        message: "SUCCESFULLY LOGGED IN",
        status: true,
        user: user,
      })
      .end();
  } catch (err) {
    next(err);
  }
}

// LOGOUT (GET)
export async function logout(req, res, next) {
  try {
    res.clearCookie("loginCookie", { sameSite: "none", secure: true });
    res.status(200).json({
      message: "Logout SUCCESSFULLY!",
      status: true,
      data: "",
    });
  } catch (err) {
    next(err);
  }
}

// FORGOT PASSWORD (POST)
export async function forgotPassword(req, res, next) {
  try {
    const kof = "forgotPassword"; // kof => "kind of function"
    const { email } = req.body;
    const userFromDb = await UserModel.findOne({
      "profile.email": email,
    });
    if (!userFromDb) {
      const err = new Error("There is no user with this email!");
      err.statusCode = 401;
      throw err;
    }

    // VERIFY EMAIL IMPLEMENT BEGIN //
    await sendMail(userFromDb, kof);
    // VERIFY EMAIL IMPLEMENT END //
    res.status(201).json({
      message: "We send you an Email to change your password.",
      status: true,
      data: "",
    });
  } catch (err) {
    next(err);
  }
}

// VERIFY RESET TOKEN (GET)
export async function verifyResetToken(req, res, next) {
  try {
    const { token } = req.params;
    const decodedToken = jwt.verify(token, JWT_KEY);
    const id = decodedToken._id;
    await UserModel.findByIdAndUpdate(
      id,
      { "meta.isVerifiedTCP": true },
      { new: true }
    );
    res
      .cookie("resetToken", token, {
        maxAge: cookieAge.oneDay,
        httpOnly: true,
        sameSite: "none",
        secure: true,
      })
      .redirect(`${FE_HOST}setnewpassword`);
  } catch (err) {
    next(err);
  }
}

// SET NEW PASSWORD (POST)
export async function setNewPassword(req, res, next) {
  try {
    // CHECK IF ACCOUNT IS VERIFIED TO SET NEW PASSWORD
    const token = req.cookies.resetToken;
    console.log("token: ", token);
    const { password } = req.body;
    let decodedToken = jwt.verify(token, JWT_KEY);
    // let user;
    // let id;
    // if (!password) {
    //   // After click on Email Link !
    //   if (decodedToken) {
    //     id = decodedToken._id;
    //     user = await UserModel.findByIdAndUpdate(
    //       id,
    //       { "meta.isVerifiedTCP": true },
    //       { new: true }
    //     );
    //     // return res.redirect(`${FE_HOST}setnewpassword/${token}`);
    //     return res
    //       .status(201)
    //       .json({ message: "User is now verified to change password." });
    //     // return res.status(201).json({
    //     //   message: "User is now verified to change password.",
    //     //   redirectUrl: `${FE_HOST}/setnewpassword/${token}`,
    //     // });
    //   } else {
    //     return res.status(400).json({ message: "Invalid or expired token." });
    //   }
    // }
    // If you are here, you clicked on the link in the email and set isVerifiedTCP to "true"
    const id = decodedToken._id;
    const user = await UserModel.findById(id);
    if (password && user.meta.isVerifiedTCP) {
      const hashedPassword = await bcrypt.hash(password, 10);
      await UserModel.findByIdAndUpdate(
        id,
        {
          "profile.password": hashedPassword,
          "meta.isVerifiedTCP": false,
        },
        { new: true }
      );
      res.json({ message: "Set new Password was SUCCESSFUL!" });
    } else {
      res.status(400).json({
        message:
          "Password change failed. Please ensure you have verified your email.",
      });
    }
  } catch (err) {
    next(err);
  }
}

// GET A USER (GET)
export async function getUser(req, res, next) {
  try {
    if (!(await UserModel.findById(req.params.id))) {
      const err = new Error("No USER with this id in Database!");
      err.statusCode = 422;
      throw err;
    }
    const user = await UserModel.findById(req.params.id)
      .populate([
        "starProjects",
        "myProjects",
        "notifications",
        "conversations",
        "follows",
      ])
      .populate([
        {
          path: "myProjects",
          populate: {
            path: "team",
            model: UserModel,
          },
        },
        {
          path: "starProjects",
          populate: {
            path: "team",
            model: UserModel,
          },
        },
        {
          path: "conversations",
          populate: {
            path: "participants",
            model: UserModel,
          },
        },
        {
          path: "conversations",
          populate: {
            path: "message",
            model: MessageModel,
          },
        },
      ]);

    res.status(200).json({
      userData: user,
      message: "Search was SUCCESSFULL!",
      status: true,
      data: "",
    });
  } catch (err) {
    next(err);
  }
}

// UPDATE A USER (PATCH)
export async function updateUser(req, res, next) {
  try {
    const userData = JSON.parse(req.body.data);
    const id = req.params.id;
    let oldUserData = await UserModel.findById(id);

    if (id !== req.token.userId) {
      const err = new Error("Not Authorized!");
      err.statusCode = 401;
      throw err;
    }

    const updateField = async (field, value) => {
      if (value) {
        oldUserData = await UserModel.findByIdAndUpdate(
          id,
          { $set: { [field]: value } },
          { new: true }
        );
      }
    };

    const updateFields = async (fields, data, prefix = "") => {
      for (const field of fields) {
        if (data.hasOwnProperty(field)) {
          const nestedField = `${prefix}${field}`;
          await updateField(nestedField, data[field]);
        }
      }
    };

    const profileFields = [
      "firstName",
      "lastName",
      "email",
      "password",
      "description",
      "goal",
      "position",
      "category",
      "toolsAndSkills",
      "avatar",
    ];
    await updateFields(profileFields, userData.profile, "profile.");

    const contactFields = [
      "mobile",
      "website",
      "online1",
      "online2",
      "online3",
      "company",
    ];
    await updateFields(contactFields, userData.contact, "contact.");

    const locationFields = ["street", "zip", "city"];
    await updateFields(locationFields, userData.location, "location.");

    const metaFields = ["darkMode", "colorTheme"];
    await updateFields(metaFields, userData.meta, "meta.");

    if (req.file) {
      const allowedMimetypes = ["png", "jpg", "jpeg", "tiff", "gif", "bmp"];
      if (allowedMimetypes.some((el) => req.file.mimetype.includes(el))) {
        cloudinary.config({
          cloud_name: CLOUDINARY_CLOUD_NAME,
          api_key: CLOUDINARY_API_KEY,
          api_secret: CLOUDINARY_API_SECRET,
        });
        const absFilePath = __dirname + "../" + req.file.path;
        const response = await cloudinary.uploader.upload(absFilePath, {
          use_filename: true,
        });
        unlink(absFilePath);
        await updateField("profile.avatar", response.secure_url);
      }
    }

    const updatedUser = await UserModel.findById(id);
    res.status(200).json({
      userData: updatedUser,
      message: "Update was SUCCESSFUL!",
      status: true,
      data: "",
    });
  } catch (err) {
    next(err);
  }
}

// FOLLOW A USER / STARTALENT (PATCH) (N)
export async function followUser(req, res, next) {
  try {
    // DEFINE NEEDED VARIABLES //
    const userId = req.body.userId;
    const follUserId = req.body.follUserId;
    const user = await UserModel.findById(userId);
    const userName = user.profile.firstName + " " + user.profile.lastName;
    // DEFINE NEEDED VARIABLES //

    // IMPORTANT: A additionally check (after auth) if the given id is the same id as in the token. We do that, because we want that the user could only change his own profile.
    // CHECK IF AUTHORIZED START//
    if (userId !== req.token.userId) {
      const err = new Error("Not Authorized FOLLOW!");
      err.statusCode = 401;
      throw err;
    }
    // CHECK IF AUTHORIZED END//

    // ADD FOLLOWED USER START //
    if (!user.follows.includes(follUserId)) {
      const user = await UserModel.findByIdAndUpdate(
        userId,
        { $push: { follows: follUserId } },
        { new: true }
      );
    } else {
      const err = new Error("You already follow this talent!");
      err.statusCode = 401;
      throw err;
    }
    // ADD FOLLOWED USER END //

    // CREATE NOTIFICATION FOR TO INFORM THE FOLLOWED USER START //
    const newNotification = await NotificationModel.create({
      receiver: follUserId,
      notText: `${userName} follows you from now on!`,
    });
    const updatedFollowUser = await UserModel.findByIdAndUpdate(follUserId, {
      $push: { notifications: newNotification._id },
    });
    // CREATE NOTIFICATION FOR TO INFORM THE FOLLOWED USER END //

    const updatedUser = await UserModel.findById(userId).populate([
      "starProjects",
      "myProjects",
      "notifications",
      "conversations",
      "follows",
    ]);

    res.status(200).json({
      message: "Follow was SUCCESSFUL!",
      status: true,
      data: updatedUser,
    });
  } catch (err) {
    next(err);
  }
}

// LEAD A USER / STARTALENT (DELETE)
export async function leadUser(req, res, next) {
  try {
    // DEFINE NEEDED VARIABLES //
    const userId = req.body.userId;
    const follUserId = req.body.follUserId;
    const user = await UserModel.findById(userId);
    // DEFINE NEEDED VARIABLES //

    // IMPORTANT: A additionally check (after auth) if the given id is the same id as in the token. We do that, because we want that the user could only change his own profile.
    // CHECK IF AUTHORIZED START//
    if (userId !== req.token.userId) {
      const err = new Error("Not Authorized!");
      err.statusCode = 401;
      throw err;
    }
    // CHECK IF AUTHORIZED END//

    // LEAD FOLLOWED USER START //
    if (user.follows.includes(follUserId)) {
      const user = await UserModel.findByIdAndUpdate(
        userId,
        { $pull: { follows: follUserId } },
        { new: true }
      );
    } else {
      const err = new Error("You don't follow this talent!");
      err.statusCode = 401;
      throw err;
    }
    // LEAD FOLLOWED USER END //

    const updatedUser = await UserModel.findById(userId).populate([
      "starProjects",
      "myProjects",
      "notifications",
      "conversations",
      "follows",
    ]);

    res.status(200).json({
      message: "Lead was SUCCESSFUL!",
      status: true,
      data: updatedUser,
    });
  } catch (err) {
    next(err);
  }
}

// DELETE USER ACCOUNT
export async function deleteUser(req, res, next) {
  try {
    // const reqToken = {
    //   email: "braun_jeff@web.de",
    //   userId: "63da55d70ac97122dfebc711"
    // }
    // IMPORTANT: A additionally check (after auth) if the given id is the same id as in the token. We do that, because we want that the user could only change his own profile.
    // if (req.params.id !== reqToken.userId) {
    if (req.params.id !== req.token.userId) {
      const err = new Error("Not Authorized! DELETE");
      err.statusCode = 401;
      throw err;
    }
    const deletedUser = await UserModel.findByIdAndDelete(
      req.params.id
    ).populate([
      "starProjects",
      "myProjects",
      "notifications",
      "conversations",
      "follows",
    ]);
    res.status(200).json({
      userData: deletedUser,
      message: "Delete was SUCCESSFUL!",
      status: true,
      data: "",
    });
  } catch (err) {
    next(err);
  }
}

// SET FIRST LOGIN
export async function setFirstLogin(req, res, next) {
  try {
    const userId = req.params.userId;
    const user = await UserModel.findById(userId);
    // console.log(userId);
    await UserModel.findByIdAndUpdate(userId, {
      meta: {
        ...user.meta,
        firstLogin: false,
        loginCount: 2,
      },
    });
    res.json({ message: "alles ok!" });
  } catch (error) {
    next(error);
  }
}

// ALT //
// const userData = req.body;
// const userFromDb = await UserModel.findOne({
//   "profile.email": userData.profile.email,
// });
// if (!userFromDb.meta.isVerifiedTCP) {
//   res.status(422).json({
//     message: "Account NOT verified to change password",
//     status: false,
//     data: "",
//   });
// }
// // CHANGE AND ENCRYPT NEW PASSWORD
// const id = userFromDb._id;
// const newPassword = req.body.profile.password;
// if (newPassword) {
//   const hashedPassword = await bcrypt.hash(newPassword, 10);
//   const updatedUser = await UserModel.findByIdAndUpdate(id, {
//     profile: { ...userFromDb.profile, password: hashedPassword },
//     meta: { ...userFromDb.meta, isVerifiedTCP: false },
//   });
//   res.status(200).json({
//     message: "Set new Password was SUCCESSFUL!",
//     status: true,
//     data: "",
//   });
// } else {
//   res.status(422).json({
//     message: "Set new Password FAILED!",
//     status: false,
//     data: "",
//   });
// }
