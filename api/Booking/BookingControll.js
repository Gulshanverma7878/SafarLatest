const BookingModel = require('./BookingModel');
const path=require('path');
const fs = require('fs');
const baseUploadsFolder = path.join(__dirname, '../../', 'uploads/Booking');


exports.get =async (req, res) => {
    BookingModel.findAll().then((data) => {
        res.send(data);
    })
}


exports.post =async (req, res) => {
    try{
        const booking = await BookingModel.create(req.body);
        if(req.files){
            await test(req, res, booking.id);
        }
        res.status(200).json({booking});

    }catch(error){
        res.status(500).json({ message: error.message });
    }
}

exports.delete = async(req, res) => {
    try{
        const deleteLikeBooking =await BookingModel.destroy({ where: { id: req.params.id } });
        res.status(200).json({ message: "Booking deleted" });
    }catch(error){
        res.status(500).json({ message: error.message });
    }
}

exports.update = async(req, res) => {
    try{
        const updateBooking = await  BookingModel.update(req.body, { where: { id: req.params.id } });
        res.status(200).json({ message: "Booking updated" });
    }catch(error){
        res.status(500).json({ message: error.message });
    }
}

exports.getById =async (req, res) => {
    try{
        const booking =await BookingModel.findOne({ where: { id: req.params.id } });
        res.status(200).json({booking});
    }catch(error){
        res.status(500).json({ message: error.message });
    }
}



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