const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { findOrCreate } = require('../Utils/findorcreate');


exports.handleGoogleCallback = async (req, res) => {
  let userData = {
    googleId: req.user.googleId,
    profile_pic: req.user.profile_pic,
    name: req.user.name,
    email: req.user.email,
  };

  try {
    const user = await findOrCreate(userData);
    let token = jwt.sign({
      data: user._id
    }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.cookie('jwthello', token);
    res.redirect('http://localhost:5173');
  } catch (error) {
    console.error('Error during authentication:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
};

exports.handleProfile = async (req, res) => {
  try {
    // Get the token from the request cookies
    const token = req.cookies.jwthello;

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user by the ID stored in the token
    const user = await User.findById(decoded.data).populate('folder');
    const folder_list = user?.folder;
    const user_data = {
      id: user._id,
      googleId: user.googleId,
      name: user.name,
      email: user.email,
      profile_pic: user.profile_pic,
    }

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({user_data, folder_list});
  } catch (error) {
    console.error('Error fetching user profile:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
}


exports.handleSignUp = async (req,res)=>{
  console.log('redirected', req.body);
  let userData = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password 
  };
  try {
    const user = await findOrCreate(userData);
    let token = jwt.sign({
      data: user._id
    }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.cookie('jwthello', token).json(user);
  } catch (error) {
    console.error('Error during authentication:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
}

exports.handleLogin = async (req,res)=>{
    const user_data = await User.findOne({email: req.body.email});
    
    if(!user_data){
        res.status(401).json({error:"User not found"});
    }
    else{
        const password_match = req.body.password===user_data.password;
        if(password_match){
          let token = jwt.sign({
            data: user_data._id
          }, process.env.JWT_SECRET, { expiresIn: '1d' });
          res.cookie('jwthello',token).status(200).json(user_data);
        }
        else{
            res.status(401).json({error:"Password does not match"});
        }
    }
}
