const  express=require('express');
const router=express.Router();
const likeGalleryController=require('./likePostControll');




router.get('/',likeGalleryController.get);
router.post("/",likeGalleryController.post);
router.delete('/:id',likeGalleryController.delete);
router.get('/:id',likeGalleryController.getOne);



module.exports=router;