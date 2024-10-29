const sequelize = require("../../config/db");
const { DataTypes, Model } = require("sequelize");
const UserModel = require('../UserAdd/UserModel');

class Booking extends Model { }

Booking.init(
    {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        destination_name: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        duration: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        file: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        treveler_type: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        Budget: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        user_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            references: {
                model: "members",
                key: "id"
            }
        }
    }
    , {
        sequelize,
        modelName: "booking",
        tableName: "booking",
        timestamps: true
    }
)


Booking.belongsTo(UserModel, { foreignKey: 'user_id' });


module.exports = Booking