const { Schema, model } = require("mongoose");
const handelMongooseError=  require('../helper/handelMongoosError')


const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
      match: /^[A-ZA][a-za]+ [A-ZA][a-za]+$/,
    },
    email: {
      type: String,
      match: /^\w+((\.|-|_)?\w+)*@\w+((\.|-|_)?\w+)*(\.\w{2,3})+$/,
    },
    phone: {
      type: String,
      match: /^\(\d{3}\)\d{3}-\d{4}$/,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'user',
    }
  },
  { versionKey: false, timestamps: true }
);
contactSchema.post("save", handelMongooseError)

const Contact = model("contact", contactSchema);

module.exports = Contact;
