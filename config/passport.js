const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const { findUserByEmail, findUserById } = require('../models/userQueries');



module.exports = function(passport) {
    // Put the LocalStrategy HERE (inside the function)
     passport.use(
     new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
        const user = await findUserByEmail(email);
        if(!user){
            return done(null, false, { message: 'Incorrect email' });
        }
        const match = await bcrypt.compare(password, user.password);
        if(!match){
            return done(null, false, { message: 'Incorrect password' });
        } else {
            return done(null, user)
        }
     })
   );
   
   passport.serializeUser((user, done) => {
     done(null, user.id);
   });

   passport.deserializeUser(async (id, done) => {
     try{
        const user = await findUserById(id)
        done(null, user)
     } catch (error) {
        done(error)
     }
   });
};