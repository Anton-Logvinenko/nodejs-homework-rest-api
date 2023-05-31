const { Schema, model } = require("mongoose");
const Joi = require("joi");
const handelMongooseError = require("../helper/handelMongoosError");

const emailMatch = /^\w+((\.|-|_)?\w+)*@\w+((\.|-|_)?\w+)*(\.\w{2,3})+$/;

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      match: emailMatch,
      unique: true,
      required: [true, "Email is required"],
    },
    password: { type: String, minglength: 6, required: [true, 'Password is required']},
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter"
    },
    token: {
      type: String,
      default: null,
    },
   
  },
  { versionKey: false, timestamps: true }
);

userSchema.post("save", handelMongooseError);

// JoiSchemas
const registerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().pattern(emailMatch).required(),
  password: Joi.string().min(6).required(),
});
const loginSchema = Joi.object({
  email: Joi.string().pattern(emailMatch).required(),
  password: Joi.string().min(6).required(),
});
// updateSubscriptionSchema
const subscription = ["starter", "pro", "business"];
const updateSubscriptionSchema= Joi.object({
  subscription:Joi.string().valid(...subscription).required(),
})

const userJoiSchemas = {
  registerSchema,
  loginSchema,
  updateSubscriptionSchema
};



const User = model("user", userSchema);

module.exports = { User, userJoiSchemas};
