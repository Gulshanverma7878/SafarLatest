const { DataTypes, Model } = require("sequelize");
const sequelize = require("../../config/db");
const likePost=require('./../PostLike/likePost')



class Post extends Model {
   
}


Post.init(
    {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        title:{
            type:DataTypes.STRING(100),
            allowNull:true,
        },
        file:{
            type: DataTypes.STRING(255),
            allowNull:true,
        },
        description :{
            type : DataTypes.TEXT,
            allowNull:true,
        },
        clicks:{
            type:DataTypes.BIGINT,
            allowNull:true,
        },
        rating:{
            type:DataTypes.BIGINT,
            allowNull:true,
            defaultValue:3
        },
        uploaded_by:{
            allowNull:true,
            type:DataTypes.BIGINT,
            references: {
                model: 'members', 
                key: 'id'       
            }
        },
    },
    {
    sequelize,
    modelName: "Post",
    tableName: "post",
    timestamps: true, 
    underscored: true 
    }
)


likePost.belongsTo(Post, { foreignKey: 'post_id' });
Post.hasMany(likePost, { foreignKey: 'post_id' });


module.exports=Post;