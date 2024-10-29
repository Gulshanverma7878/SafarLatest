const { DataTypes, Model } = require("sequelize");
const sequelize = require("../../config/db");

class PostLike extends Model {

}


PostLike.init(
    {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        post_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            references: {
                model: 'post',
                key: 'id',
            }
        },
        user_id: {
            type: DataTypes.BIGINT,
            references: {
                model: "members",
                key: 'id'
            }
        }
    },
    {
        sequelize,
        modelName: "PostLike",
        tableName: "postlike",
        timestamps: true,
        underscored: true
    }
)





module.exports = PostLike;