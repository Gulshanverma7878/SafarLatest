const Post = require('./PostModel');
const fs = require('fs');
const path = require('path');

const baseUploadsFolder = path.join(__dirname, '../../', 'uploads/gallery');

// 1. Add Gallery
exports.addGallery = async (req, resp) => {
  try {
    const add = await Post.create(req.body);
    const updatePath = await Post.update(
      { file: `/uploads/gallery/${add.id}/${req.files.file.name}` },
      { where: { id: add.id } }
    );
    test(req, resp, add.id);
    resp.status(200).json(add);
  } catch (error) {
    resp.status(500).json(error);
  }
};

// 2. Paginated getGallery
exports.getGallery = async (req, resp) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  try {
    const { count, rows } = await Post.findAndCountAll({ limit, offset });
    resp.status(200).json({
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      data: rows
    });
  } catch (error) {
    console.log("Error in getGallery:", error);
    resp.status(500).json({ message: "Internal Server Error" });
  }
};

// 3. Update Gallery
exports.updateGallery = async (req, resp) => {
  const { id } = req.params;

  try {
    const updateData = await Post.update(req.body, { where: { id } });
    if (req.files && req.files.file) {
      await test(req, resp, id);
      await Post.update(
        { file: `/uploads/gallery/${id}/${req.files.file.name}` },
        { where: { id } }
      );
    }
    resp.status(200).json({ message: "Update successful" });
  } catch (error) {
    console.error("Error in updateGallery:", error);
    resp.status(500).json({ message: "Internal Server Error" });
  }
};

// 4. Delete Gallery
exports.deleteGallery = async (req, res) => {
  const uploadPath = path.join(__dirname, '../../uploads/gallery');
  try {
    const deleteGalleryData = await Post.destroy({ where: { id: req.params.id } });
    if (deleteGalleryData === 1) {
      const galleryPath = `${uploadPath}/${req.params.id}`;
      await fs.rm(galleryPath, { recursive: true, force: true });
      return res.status(200).json({ message: "Deletion successful" });
    } else {
      return res.status(404).json({ message: "Gallery item not found" });
    }
  } catch (error) {
    console.error("Error during deletion:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// File Upload Helper Function
if (!fs.existsSync(baseUploadsFolder)) {
  fs.mkdirSync(baseUploadsFolder, { recursive: true });
}

const test = async (req, resp, id) => {
  const uploadedFile = req.files.file;
  if (!uploadedFile) {
    console.log('No file uploaded');
    return;
  }

  const idFolderPath = path.join(baseUploadsFolder, String(id));
  if (!fs.existsSync(idFolderPath)) {
    fs.mkdirSync(idFolderPath, { recursive: true });
  }

  const uploadPath = path.join(idFolderPath, uploadedFile.name);
  uploadedFile.mv(uploadPath, (err) => {
    if (err) {
      console.log(err);
      return resp.status(500).send('Failed to upload file.');
    }
    console.log(`${uploadedFile.name} uploaded!`);
  });
};
