const { DataTypes, Model } = require("sequelize");
const sequelize = require("../../config/db");
const UserModel=require('../UserAdd/UserModel');
const PostModel=require('../Post/PostModel');

class Reviews extends Model { }

Reviews.init(
    {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            references: {
                model: 'members',
                key: 'id',
            }
        },
        post_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            references: {
                model: 'post',
                key: 'id',
            }
        },
        review: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        rating: {
            type: DataTypes.BIGINT,
            allowNull: false,
        }

    },
    {
        sequelize,
        modelName: "Reviews",
        tableName: "reviews",
        timestamps: true,

    }
);

Reviews.belongsTo(UserModel, { foreignKey: 'user_id' });
Reviews.belongsTo(PostModel, { foreignKey: 'post_id' });


module.exports = Reviews;