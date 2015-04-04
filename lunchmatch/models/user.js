/**
 * Created by minzhiwang on 4/4/15.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    /*name: {
        first: {type: String, required: true},
        last: {type: String, required: true}
    },
    email: {type: String, required: true, lowercase: true, trim: true, index: true},
    password: {type: String, required: true},*/
    a1: {type: String, required: true},
    a2: {type: String, required: true},
    a3: {type: String, required: true},
    a4: {type: String, required: true},
    a5: {type: String, required: true},
    a6: {type: String, required: true},
    a7: {type: String, required: true}
});

module.exports = mongoose.model("User", userSchema);