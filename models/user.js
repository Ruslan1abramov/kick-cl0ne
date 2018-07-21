var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const bcrypt = require("bcrypt");


var UserSchema = new mongoose.Schema({
    username: { type: String, required: true , unique: true},
    passwordHash: { type: String, required: true },
    isAdmin: { type: Boolean, default: false }
});

UserSchema.plugin(uniqueValidator);

UserSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.passwordHash);
};

UserSchema.virtual("password").set(function(value) {
    this.passwordHash = bcrypt.hashSync(value, 12);
});


module.exports = mongoose.model("User", UserSchema);
