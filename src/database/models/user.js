const { default: mongoose } = require("mongoose");
const validator = require('validator');
const crypto = require('node:crypto')

let UserSchema = new mongoose.Schema(
    // mongoose.Schema takes multiple arguments:
    // 1. Our custom schema properties:
    {
        // username as identifier, and to display a name under author names
        username: {
            type: String,
            required: true,
            minLength: 2
        },
        password: {
            type: String,
            required: true,
            minLength: 8,
            validate: {
                validator: function (newPassword) {
                    let passwordStrengthRules = {
						minLength: 8,
						minLowercase: 1,
						minUppercase: 1,
						minNumbers: 1,
						minSymbols: 0,
						returnScore: false,
						pointsPerUnique: 1,
						pointsPerRepeat: 0.5,
						pointsForContainingLower: 10,
						pointsForContainingUpper: 10,
						pointsForContainingNumber: 10,
						pointsForContainingSymbol: 10                        
                    };
                    return validator.isStrongPassword(newPassword, passwordStrengthRules);
                },
                message: validatorError => `${validatorError.value} is nota suitable password!`
            }
        },
        salt: {
            type: String,
            required: false,
            default: function () {
                return crypto.randomBytes(64).toString('hex');
            }
        },
        isAdmin: {
            type: Boolean,
            required: false
        },
        isBanned: {
            type: Boolean,
            required: false
        }
    },
    {
        timestamps: true
    }
);

UserSchema.pre(
    "save",
    async function (next) {
        if (!this.salt){
            // If no salt is already on the user, e.g. if they're brand-new,
            // make a salt for the user
            this.salt = crypto.randomBytes(64).toString('hex');
            // This will be saved into the user document at the end of the middleware
        }

        // If the password has not been changed, skip the rest of this function
        // The isModified function is pre-made by Mongoose, it's super handy!
		// https://mongoosejs.com/docs/api/document.html#Document.prototype.isModified()
        if (!this.isModified("password")) return next();

        // SO by the time we get here:
        // A user has a salt
        // A user has modified their password
        // We must assume that a modified password is plaintext, eg from a user updating their account
        // This means we must hash and salt the new password!
        this.password = crypto.scryptSync(this.password, this.salt, 64).toString('hex');

        // and that's it! The password is now hashed and salted, we move on by calling next
        next();
    }
);

// We can add custom functions to a schema by assigning them to the schema.methods object
// Just make sure our custom function name is definitely not already declared elsewhere on the schema though!
UserSchema.methods.isMatchingPassword = async function (passwordToCheck) {
    // A couple of steps happening in brief code here:
    // 1. Generate another hashed and salted version of the user's password, using passwordToCheck
    // 2. If the hashed and salted version of passwordToCheck matches the hashed and salted password
    // in the database, then the passwordToCheck is the correct password
    return crypto.scryptSync(passwordToCheck, this.salt, 64).toString('hex') == this.password;
}

// With all that custom schema stuff going on, we must still remember to make a model based on the schema!
const UserModel = mongoose.model("User", UserSchema);

// and export the schema and model for other files to use:
module.exports = {
    UserSchema, UserModel
}