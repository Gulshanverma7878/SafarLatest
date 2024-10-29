const { Op } = require("sequelize");


const _getAll = async (req, res, model) => {
  try {
    const response = await model.findAll();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const _getDataListById = async (req, res, model, fieldName, fieldValue) => {
  try {
    const response = await model.findAll({
      where: { [fieldName]: fieldValue },
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const _update = async (req, res, model) => {
  try {
    const { id } = req.params; // Take id from req.params
    console.log(id);
    const response = await model.update(req.body, {
      where: {
        id: id, // Use id from req.params
      }
    });
    if (response[0] === 0) {
      return res.status(404).json({ error: "Record not found" });
    }
    res.status(200).json({ message: "Update successful" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const _delete = async (req, res, model) => {
  try {
    const { id } = req.params; // Take id from req.params
    const response = await model.destroy({
      where: {
        id: id, // Use id from req.params
      },
    });
    if (response === 0) {
      return res.status(404).json({ error: "Record not found" });
    }
    res.status(200).json({ message: "Deletion successful" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

const _add = async (req, res, model) => {
  try {
    const response = await model.create(req.body);
    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({ error })
  }
};






//For nominees Fields

const cutstring = (name) => {
  let newName = "";
  for (let i = 0; i < 3; i++) {
    newName += (name[i]);
    // console.log(newName);
  }
  return newName
}

// const _addNominee = async (req, res, model) => {
//   try {
//     console.log(req.files);
//     const aadharUrl=req.files.file.name;
//     const id_file=req.files.file2.name;
//     const profile=req.files.profile.name;
//     const state=req.body.state;
//     const district=req.body.district;
//     const regi=cutstring(state)+cutstring(district);
//     req.body.reference_id="";

//     if (req.files.diseaseFile){
//       var diseaseFile = req.files.diseaseFile.name;
//     }

//     console.log(profile)
//     console.log(id_file);
//     console.log(aadharUrl);

//     const response = await model.create(req.body);
//     console.log(response.id)
//     const updatepath=await model.update(
//       { aadharUrl:`/api/file/members/${response.id}/${aadharUrl}`,
//         id_file:  `/api/file/members/${response.id}/${id_file}`,
//         profileUrl:`/api/file/members/${response.id}/${profile}`,
//         diseaseFile: diseaseFile ? `/api/file/members/${response.id}/${diseaseFile}` : '',
//         reference_id:response.id+regi.toUpperCase(),
//       },
//       {
//         where: { id: response.id }
//       }

//     )
//     const updatedResponse = await model.findOne({ where: { id: response.id } });
//     console.log(updatedResponse);
//     return updatedResponse;
//   } catch (error) {
//     console.log(error)
//     res.status(500).json({ error: error });
//   }
// };



const _addNominee = async (req, res, model) => {
  try {
    console.log("Incoming files:", req.files);
    const aadharUrl = req.files.file.name;
    const id_file = req.files.file2.name;
    const profile = req.files.profile.name;
    const state = req.body.state;
    const district = req.body.district;
    const regi = cutstring(state) + cutstring(district);
    req.body.reference_id = "";

    if (req.files.diseaseFile) {
      var diseaseFile = req.files.diseaseFile.name;
    }

    console.log("Files details:");
    console.log("Profile:", profile);
    console.log("ID File:", id_file);
    console.log("Aadhar URL:", aadharUrl);
    console.log("State Shortcode:", cutstring(state));
    console.log("District Shortcode:", cutstring(district));
    if (req.body.marriage_date == "") {
      delete req.body.marriage_date;
    }

    const response = await model.create(req.body);
    console.log("Newly created nominee record:", response);

    const updatePath = await model.update(
      {
        aadharUrl: `/api/file/members/${response.id}/${aadharUrl}`,
        id_file: `/api/file/members/${response.id}/${id_file}`,
        profileUrl: `/api/file/members/${response.id}/${profile}`,
        diseaseFile: diseaseFile ? `/api/file/members/${response.id}/${diseaseFile}` : '',
        reference_id: `ABSS${cutstring(state).toUpperCase()}${cutstring(district).toUpperCase()}${response.id}`,
      },
      {
        where: { id: response.id }
      }
    );

    const updatedResponse = await model.findOne({ where: { id: response.id } });
    console.log("Updated nominee record with paths:", updatedResponse);

    return updatedResponse;
  } catch (error) {
    console.error("Error in _addNominee:", error);
    res.status(500).json({ error: error });
  }
};






const _addNominees = async (req, res, model, id) => {
  try {
    const response = await model.create({
      user_id: id,
      nominee: req.body.nominee,
      relationship: req.body.relationship,
      nominee2: req.body.nominee2,
      relationship2: req.body.relationship2,

    });
    return response;
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
};



///For update CRUD
const _getMemberData = async (req, res, model) => {
  try {
    const response = await model.findAll(
      {
        attributes: {
          exclude: ['password']
        },
        include: [{
          model: "Nominee",
          as: 'nominees', // This should match the alias used in the association
          attributes: ['id', 'name', 'relationship', 'name2', 'relationship2'] // Include only the necessary fields
        }]
      }

    );
    return response;
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const Pagination = async (req, res, model) => {
  try {

    const page = parseInt(req.params.page) || 1;
    const pageSize = parseInt(req.params.pageSize) || 10;

    const offset = (page - 1) * pageSize;

    const response = await model.findAndCountAll({
      attributes: {
        exclude: ['password']
      },
      limit: pageSize,
      offset: offset
    });


    const { count, rows } = response;
    const totalPages = Math.ceil(count / pageSize);
    const currentPage = page;
    res.json({
      currentPage,
      totalPages,
      totalCount: count,
      data: rows
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};






//// for Forget Password



const bcrypt = require('bcryptjs');



const _checkPassUser = async (req, res, model) => {
  console.log("CHECK PASSUSER")

  try {
    const response = await model.findAll({
      where: {
        Otp: req.body.otp,
        mobile_no: req.params.id,
        // time: {
        //   [Op.between]: [
        //     new Date(new Date() - 5 * 60 * 1000),
        //     new Date() 
        //   ]
        // } 
      },

    });

    console.log(response);
    if (response == '') {
      return false
    }
    return response;

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const _forget = async (req, res, model, otp) => {
  console.log(otp)
  try {

    const deleteResult = await model.destroy({
      where: { mobile_no: req.params.id, },
    });

    const response = await model.create({
      mobile_no: req.params.id,
      Otp: otp
    });

    res.status(201).json({ message: "OTP sended" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const _updatePassword = async (req, res, model) => {
  try {
    const id = req.params.id;

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }
    const response = await model.update(req.body, {
      where: {
        mobile_no: id,
      }
    });
    if (response[0] === 0) {
      return res.status(404).json({ error: " Record not found " });
    }
    res.status(200).json({ message: "Update successful" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const _GetDetail = async (req, res, model) => {
  try {
    const response = await model.findAll({
      where: { mobile_no: req.params.id },
    });
    return response;
  } catch (error) {
    return 0;
  }
};

const saveOTP = async (req, resp, model, otp, sendMail) => {
  try {
    // const deleteResult = await  model.destroy({where: {via: req.body.via },
    // });
    const save = await model.create({
      via: req.body.via,
      otp: otp,
    });

    resp.status(200).json({ message: "Otp sended", data: sendMail });
  } catch (error) {
    resp.status(500).json(error);
  }
}

const OTPVERIFYMEMBER = async (req, resp, model, otp) => {
  console.log(req.body);
  try {
    const response = await model.findOne({
      where: {
        via: req.body.via,
        otp: otp
      }
    });
    if (!response) {
      return resp.status(404).json({ error: "OTP not found" });
    }
    if (response) {
      model.destroy({
        where: {
          via: req.body.via,
          otp: otp
        }
      }
      )
      resp.status(200).json({ message: "verified" });

    }

  } catch (error) {
    console.error(error);
    resp.status(500).json({ error: "Internal server error" });
  }
};



const RoleData = async (req, res, model) => {
  try {
    const response = await model.findAll({
      where: {
        user_id: req.params.id
      }

    });
    return (response);
  } catch (error) {
    return error
  }
};


const RoleDataReturn = async (req, res, model, id) => {
  try {
    console.log(id)
    const response = await model.findAll({
      where: {
        user_id: id
      }
    });
    // console.log(response)
    return (response);
  } catch (error) {
    return error
  }
};


const _updateRole = async (req, res, model) => {
  try {
    const { id } = req.params; // Take id from req.params
    console.log(id);
    const response = await model.update(req.body, {
      where: {
        user_id: id,
      }
    });
    if (response[0] === 0) {
      return res.status(404).json({ error: "Record not found" });
    }
    res.status(200).json({ message: "Update successful" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  RoleDataReturn,
  _updateRole,
  _GetDetail,
  RoleData,
  OTPVERIFYMEMBER,
  saveOTP,
  _updatePassword,
  _checkPassUser,
  _forget,
  Pagination,
  _getMemberData,
  _addNominee,
  _addNominees,
  _getAll,
  _getDataListById,
  _update,
  _delete,
  _add,
};

