const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user-model');
const getRndInteger = require('../utils/random');
const { sendingEmail } = require('../services/mail-services');
require('dotenv').config();

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_MAILER_CLIENT_ID,
            clientSecret: process.env.GOOGLE_MAILER_CLIENT_SECRET,
            callbackURL: '/auth/google/callback'
        },
        async (accessToken, refreshToken, profile, done) => {
            const email = profile.emails[0].value;
            const name = profile.displayName;
            try {
                // Tìm người dùng dựa trên email
                let user = await User.findOne({ where: { email: email } });
                if (user) {
                    return done(null, user);

                } else {
                    const tmp_password = getRndInteger(100000, 999999) + "";
                    user = await User.create({
                        name: name,
                        email: email,
                        password: tmp_password
                    });

                    const payload = {
                        title: process.env.TITLE_REGISTER_SUCCESSFULLY,
                        uEmail: email,
                        password: tmp_password
                    }

                    await sendingEmail(payload);

                    return done(null, user);
                }
            } catch (err) {
                return done(err, null);
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findByPk(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

module.exports = passport;