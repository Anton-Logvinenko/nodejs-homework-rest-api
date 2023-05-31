const Contact = require("../models/contacts");
const HttpError = require("../helper/HttpError");
 const ctrlWrapper= require("../decorators/ctrlWrapper")




const getAllContacts = async (req, res) => {
  const{_id: owner}=req.user
const{page=1, limit=20}= req.query
const skip= (page-1)*limit
        const result = await Contact.find({owner},"-createdAt -updatedAt", {skip, limit}).populate("owner", "name email");
     
    res.json(result);
};

const getContactByIdb = async (req, res) => {
     const { id } = req.params;
    const result = await Contact.findById(id);
    if (!result) {
      throw HttpError(404, `Contact with id '${id}' not found`);
    }
    res.json(result);
 };

const addContact = async (req, res) => {
const{_id:owner}=req.user
       const result = await Contact.create({...req.body, owner});
    
    res.status(201).json(result);
 };

const removeContact = async (req, res) => {
    const { id } = req.params;
    const result = await Contact.findByIdAndDelete(id);
    if (!result) {
      throw HttpError(404, `Contact with id '${id}' not found`);
    }
    res.json({ message: "contact deleted" });
 };

const updateContact = async (req, res) => {   
    const { id } = req.params;
    const result = await Contact.findByIdAndUpdate(id, req.body, {new: true});
    if (!result) {
      throw HttpError(
        404,
        `Missing fields! Contact with id '${id}' not found.`
      );
    }
    res.json(result);
};

const updateFavorite = async (req, res) => {
     const { id } = req.params;
    const result = await Contact.findByIdAndUpdate(id, req.body, {new: true});
    if (!result) {
      throw HttpError(
        404,
        `Missing fields! Contact with id '${id}' not found.`
      );
    }
    res.json(result);
};






module.exports = {
  getAllContacts: ctrlWrapper(getAllContacts),
  getContactByIdb: ctrlWrapper(getContactByIdb),
  addContact: ctrlWrapper(addContact),
  removeContact: ctrlWrapper(removeContact),
  updateContact: ctrlWrapper(updateContact),
  updateFavorite: ctrlWrapper(updateFavorite),
};
