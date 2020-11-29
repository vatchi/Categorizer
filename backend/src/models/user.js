import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { InternalServerError } from '../utils/errors';

const salt = 10;

const userSchema = new mongoose.Schema(
    {
        firstname: {
            type: String,
            required: true,
            maxlength: 100
        },
        lastname: {
            type: String,
            required: true,
            maxlength: 100
        },
        email: {
            type: String,
            required: true,
            trim: true,
            unique: true
        },
        password: {
            type: String,
            required: true,
            minlength: 8
        },
        password2: {
            type: String,
            required: true,
            minlength: 8

        },
        token: {
            type: String
        }
    },
    { timestamps: true },
);

userSchema.pre('save', function (next) {
    var user = this;

    if (user.isModified('password')) {
        bcrypt.genSalt(salt, function (error, salt) {
            if (error) {
                return next(new InternalServerError(error));
            }

            bcrypt.hash(user.password, salt, function (error, hash) {
                if (error) {
                    return next(new InternalServerError(error));
                }

                user.password = hash;
                user.password2 = hash;
                next();
            })

        })
    }
    else {
        next();
    }
});

// Todo: can we replace Callbacks with promises or something instead?
userSchema.methods.comparePassword = function (password, cb) {
    bcrypt.compare(password, this.password, function (err, isMatch) {
        if (err) {
            return cb(next);
        }
        cb(null, isMatch);
    });
}

userSchema.methods.generateToken = function (cb) {
    var user = this;
    var token = jwt.sign(user._id.toHexString(), process.env.MY_SECRET);

    user.token = token;
    user.save(function (err, user) {
        if (err) {
            return cb(err);
        }
        cb(null, user);
    })
}

userSchema.statics.findByToken = function (token, cb) {
    var user = this;

    jwt.verify(token, process.env.MY_SECRET, function (err, decode) {
        user.findOne({ "_id": decode, "token": token }, function (err, user) {
            if (err) {
                return cb(err);
            }
            cb(null, user);
        })
    })
};

userSchema.methods.deleteToken = function (token, cb) {
    var user = this;

    user.update({ $unset: { token: 1 } }, function (err, user) {
        if (err) {
            return cb(err);
        }
        cb(null, user);
    })
}

const User = mongoose.model('User', userSchema);

export default User;