const User = require('../models/User')
exports.findOrCreate = async (userData) => {
    try {
      // Use findOneAndUpdate with upsert
      const user = await User.findOneAndUpdate(
        { email: userData.email
        },
        { 
          $setOnInsert: {
            googleId: userData?.googleId||"",
            name: userData.name,
            email: userData.email,
            password: userData?.password||""
          }
        },
        { 
          new: true,
          upsert: true
        }
      );
      
      return user;
    } catch (error) {
      console.error('Error in findOrCreate:', error);
      throw error;
    }
  };