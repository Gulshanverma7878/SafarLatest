const jwt = require('jsonwebtoken');
const User = require('../api/Members/member-model');
const RoleControll=require('../api/Rolemanagement/roleController');
const RoleModel=require('../api/Rolemanagement/roleManagementModel');
const AdminModel=require('../api/userProfile/user-model');

/// In this Add Role Authentication



const authenticate = async (req, res, next) => {
  try {
    // Get token from headers
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);

    // Find user and admin based on the decoded token
    const user = await User.findByPk(decoded.id);
    const admin = await AdminModel.findOne({
      where: {
        // id: decoded.id,
        email:decoded.id //id is email
        // role: 'admin'
        // email:
      }
    });

    


    if (admin) {
      console.log(admin);
      req.userRole = 'admin';
      req.token = token;
      console.log('User Role:', req.userRole);
      return next(); // Return to avoid further execution
    } 
    
    // Check if user
    if (user) {
      req.userRole = await RoleControll.getDataReturn(req, res, RoleModel, user.id);
      req.user = user;
      req.token = token;
      console.log('User Role:', req.userRole);
      return next(); // Return to avoid further execution
    }

    // User not found
    return res.status(404).json({ error: 'User not found' });

  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ error: 'Please authenticate' });
  }
};




const checkPermission = (action, role) => async (req, res, next) => {
  try {

    console.log("check role")
    console.log(action,role,req.userRole);
    if (req.userRole === 'admin') {
      return next();
    }
    const userRole = req.userRole;
    console.log(userRole);
    if (!userRole || !userRole[role] || userRole[role][action] === undefined) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    if (userRole[role][action]) {
      console.log("TTT")
      console.log(userRole[role][action])
      return next();
    }
    console.log('error')
    return res.status(403).json({ message: 'Forbidden' });
  } catch (error) {
    console.log("EEEE",error)
    console.error('Permission error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



module.exports = {
  authenticate,
  checkPermission
};
