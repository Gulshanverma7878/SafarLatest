const express = require('express');
const router = express.Router();
const Post=require('./PostController');




router.get('/',Post.getGallery);
router.post('/',Post.addGallery);
router.delete('/:id',Post.deleteGallery);
router.put("/:id",Post.updateGallery);





module.exports=router;