const mongoose = require("mongoose");
const { Schema } = mongoose;
const encriptar = require("bcryptjs");

const userSchema = new Schema({
    userName: {
        type: String,
        lowercase: true,
        required: true,
    },
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    tokenConfirm: {
        type: String,
        default: null,
    },
    cuentaConfirm: {
        type: Boolean,
        default: false,
    },
    imagen: {
        type: String,
        default: null,
    }
});

userSchema.pre('save', async function (next) {
    const Usuario = this;
    if (!Usuario.isModified('password')) return next();

    try {
        const salt = await encriptar.genSalt(10);
        const hash = await encriptar.hash(Usuario.password, salt);
        Usuario.password = hash;
        next();
    } catch (error) {
        console.log({ error: 'Error al hashear la contraseña' });
        next();
    }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    return await encriptar.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;