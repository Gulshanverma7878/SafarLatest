const ReviewsModel=require('./ReviewsModel');
const memberModel=require('../UserAdd/UserModel');
const PostModel=require('../Post/PostModel');


exports.get = async (req, res) => {
    try {
        const { page = 1, pageSize = 10 } = req.query; // Default to page 1, 10 items per page
        const offset = (page - 1) * pageSize;
        const limit = parseInt(pageSize);

        const reviews = await ReviewsModel.findAndCountAll({
            include: [
                {
                    model: memberModel,
                    attributes: ['name', 'profile']
                }
            ],
            limit,
            offset
        });

        res.status(200).json({
            totalItems: reviews.count,
            totalPages: Math.ceil(reviews.count / limit),
            currentPage: parseInt(page),
            data: reviews.rows
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.getOne = async (req, res) => {
    try {
        const { page = 1, pageSize = 10 } = req.query; // Default to page 1, 10 items per page
        const offset = (page - 1) * pageSize;
        const limit = parseInt(pageSize);

        const reviews = await ReviewsModel.findAndCountAll({
            where: { post_id: req.params.id },
            include: [
                {
                    model: memberModel,
                    attributes: ['name', 'profile']
                }
            ],
            limit,
            offset
        });

        res.status(200).json({
            totalItems: reviews.count,
            totalPages: Math.ceil(reviews.count / limit),
            currentPage: parseInt(page),
            data: reviews.rows
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};




exports.post=async(req,res)=>{
    try{
        const review = await ReviewsModel.create(req.body);
        res.status(200).json({review});
    }catch(error){
        res.status(500).json({ message: error.message });
    }
}

exports.put=async(req,res)=>{
    try{
        const review = await ReviewsModel.update(req.body, { where: { id: req.params.id } });
        res.status(200).json({ message: "Update successful" });
    }catch(error){
        res.status(500).json({ message: error.message });
    }
}

exports.delete=async(req,res)=>{
    try{
        const review = await ReviewsModel.destroy({ where: { id: req.params.id } });
        res.status(200).json({ message: "Delete successful" });
    }catch(error){
        res.status(500).json({ message: error.message });
    }
}