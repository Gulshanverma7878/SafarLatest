const REST_API = require("../../utils/crudHelper");
const User = require('./UserModel');
const Mail = require('../../config/nodemailer/nodemailer');
const path = require('path');
const fs = require('fs');

const baseUploadsFolder = path.join(__dirname, '../../', 'uploads/user');

exports.get = async (req, resp) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 100;
        const offset = (page - 1) * limit;
        const { count, rows } = await User.findAndCountAll({ limit, offset });
        resp.status(rows ? 200 : 400).json(rows ? {
            totalItems: count,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            data: rows
        } : "Empty data");
    } catch (error) {
        console.error(error);
        resp.status(500).json({ message: error.message });
    }
};

exports.post = async (req, resp) => {
    try {
        const user = await User.create(req.body);
        await handleFileUpload(req.files.profile, user.id);
        await user.update({ profile: `uploads/user/${req.files.profile.name}`});
        
        resp.status(200).json({ message: "User created" });
    } catch (error) {
        resp.status(500).json({ message: error.message });
    }
};

exports.delete = async (req, resp) => {
    try {
        const deleted = await User.destroy({ where: { id: req.params.id } });
        resp.status(deleted ? 200 : 404).json({ message: deleted ? "Delete successful" : "User not found" });
    } catch (error) {
        resp.status(500).json({ message: "Deletion failed" });
    }
};

exports.put = async (req, resp) => {
    try {
        const updated = await User.update(req.body, { where: { id: req.params.id } });
        if (updated[0]) await handleFileUpload(req.files.profile, req.params.id);
        resp.status(200).json({ message: "Update successful" });
    } catch (error) {
        resp.status(500).json({ message: "Update failed" });
    }
};

// File Upload Helper
const handleFileUpload = async (file, id) => {
    if (!file) return;
    const userFolderPath = path.join(baseUploadsFolder, String(id));
    fs.mkdirSync(userFolderPath, { recursive: true });
    file.mv(path.join(userFolderPath, file.name), (err) => {
        if (err) console.error("File upload failed:", err);
        else console.log(`${file.name} uploaded successfully.`);
    });
};


exports._updatePassword = async (req, res, model) => {
    try {
        const id = req.params.id;

        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt);
        }
        const response = await model.update(req.body, {
            where: {
                mobile_no: id,
            }
        });
        if (response[0] === 0) {
            return res.status(404).json({ error: " Record not found " });
        }
        res.status(200).json({ message: "Update successful" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};