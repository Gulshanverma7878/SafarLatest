const LikePost = require('../PostLike/likePost');
const postModel = require('../Post/PostModel');



exports.post = async (req, res) => {
    try {
        const likeGallery = await LikePost.create(req.body);
        res.status(200).json({ message: "Like Gallery created" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

}


exports.getOne = async (req, res) => {
    try {
        const { page = 1, pageSize = 10 } = req.query; // Default to page 1, 10 items per page
        const offset = (page - 1) * pageSize;
        const limit = parseInt(pageSize);
        const likeGallery = await LikePost.findAll({
            where: { user_id: req.params.id },
            include: [
                {
                    model: postModel,
                    attributes: ['id', 'title', 'file']
                }
            ],
            limit: limit,
            offset: offset
        });

        res.status(200).json(likeGallery);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.get = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        const { count, rows } = await LikePost.findAndCountAll({
            limit,
            offset,
            include: [
                {
                    model: GalleryModel,
                    as: 'gallery',
                    attributes: ['id', 'title', 'file']
                }
            ]
        });

        res.status(200).json({
            totalItems: count,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            data: rows
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

}


exports.delete = async (req, res) => {
    try {
        const deleteLikeGallery = await LikePost.destroy({ where: { id: req.params.id } });
        res.status(200).json({ message: "Like Gallery deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}