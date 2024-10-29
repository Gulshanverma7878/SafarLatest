const express=require('express');
const router=express.Router();
const ReviewsController=require('./ReviewsControll');

router.get('/',ReviewsController.get);
router.post('/',ReviewsController.post);
router.delete('/:id',ReviewsController.delete);
router.put("/:id", ReviewsController.put);
router.get('/:id',ReviewsController.getOne);


module.exports=router