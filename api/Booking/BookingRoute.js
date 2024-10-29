const express=require('express');
const router=express.Router();
const BookingController=require('./BookingControll');


router.get('/',BookingController.get);
router.post('/',BookingController.post);
router.put("/:id",BookingController.update);
router.delete('/:id',BookingController.delete);
router.get('/:id',BookingController.getById);

module.exports=router;