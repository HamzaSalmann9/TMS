const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String
    },
    email: {
        required: true,
        type: String,
        unique:true,
        validate: {
      validator: async function (email) {
        const user = await this.constructor.findOne({ email });
        if (user) {
          if (this.id === user.id) {
            return true;
          }
          return false;
        }
        return true;
      },
      message: props => `${props.value} already exists!`
    }
    },
    password: {
        type: String,
        minlength: 6,
        required: true,
      },
    role: {
        type: String,
        default: "Basic",
        enum: ["Admin", "Basic"],
        required: true,
      },
})

module.exports = mongoose.model('User', userSchema)