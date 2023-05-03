const User = require('../models/User');
const { nanoid } = require('nanoid');
const { request } = require('express');
const { validationResult } = require('express-validator');

const registerUser = async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.flash('mensajes', errors.array());
        return res.redirect('/auth/register')
    }

    const { UserName, Email, Password } = req.body;

    try {

        let Usuario = await User.findOne({ email: Email });
        if (Usuario) throw new Error('El correo electronico ya esta en uso');

        Usuario = new User({ userName: UserName, email: Email, password: Password, tokenConfirm: nanoid(20) });
        await Usuario.save();
        req.flash('mensajes', [{ msg: 'Revise su correo electronico para validad su cuenta' }]);
        return res.redirect('/auth/login');
    } catch (error) {
        req.flash('mensajes', [{ msg: error.message }]);
        return res.redirect('/auth/register')
    }
};

const confirmarCuenta = async (req, res) => {
    const { token } = req.params;

    try {
        let Usuario = await User.findOne({ tokenConfirm: token })
        if (!Usuario) throw new Error('No existe un usuario para confirmar con el token');

        Usuario.cuentaConfirm = true;
        Usuario.tokenConfirm = null;

        await Usuario.save();
        req.flash('mensajes', [{ msg: 'Cuenta verificada, ya puedes ingresar' }]);
        return res.redirect('/auth/login');
    } catch (error) {
        req.flash('mensajes', [{ msg: error.message }]);
        return res.redirect('/auth/login')
    }

};

const formRegister = (req, res) => {
    res.render('register', { mensajes: req.flash('mensajes'), user: req.user });
};

const loginUsuario = async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.flash('mensajes', errors.array());
        return res.redirect('/auth/login')
    }

    const { Email, Password } = req.body;

    try {

        let Login = await User.findOne({ email: Email });
        if (!Login) throw new Error('No existe un usuario con el correo');
        if (!Login.cuentaConfirm) throw new Error('Su cuenta no esta validada');
        if (!await Login.comparePassword(Password)) throw new Error('La contraseña es incorrecta');

        req.login(Login, function (err) {
            if (err) {
                throw new Error("Error de passport");
            }
            return res.redirect("/");
        });
    } catch (error) {
        req.flash('mensajes', [{ msg: error.message }]);
        return res.redirect('/auth/login')
    }

};

const formLogin = (req, res) => {
    res.render('login', { mensajes: req.flash('mensajes'), user: req.user });
};

const cerrarSesion = (req, res) => {
    req.logout(req.user, err => {
        if (err) return next(err);
        res.redirect("/auth/login");
    });
};

module.exports = {
    formRegister,
    formLogin,
    registerUser,
    confirmarCuenta,
    loginUsuario,
    cerrarSesion
};