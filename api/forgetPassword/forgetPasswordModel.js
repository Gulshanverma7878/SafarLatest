const { DataTypes, Model } = require("sequelize");
const sequelize = require("../../config/db");
const bcrypt = require('bcryptjs');

class Password extends Model {
  async validatePassword(password) {
    return bcrypt.compare(password, this.password);
  }
}

Password.init(
  {
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      // references: {
      //     model: 'members', 
      //     key: 'id'       
      // }
    },
    mobile_no: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    Otp: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    time: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    }


  },
  {
    sequelize,
    modelName: "forgetpassword",
    tableName: "forgetpasswordOTP",
    timestamps: false,
  }
);

module.exports = Password;
