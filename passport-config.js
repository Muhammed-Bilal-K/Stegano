const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const users = require('./model/user');
const passport = require("passport");


passport.use(new LocalStrategy(async function (email, password, done) {
    const currentuser = await users.getUserByEmail({ email });

    if (!currentuser) {
        return done(null, false, { message: " No user found with that email" });
    }
    try {
        if (!bcrypt.compareSync(password, currentuser.password)) {
            return done(null, false, { message: " Password incorrect" });
        }
        return done(null, currentuser);
    } catch (e) {
        console.log(e);
        return done(e);
    }
}))

