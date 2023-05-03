const express = require('express');
const { body } = require('express-validator');
const { formRegister, formLogin, registerUser, confirmarCuenta, loginUsuario, cerrarSesion } = require('../controllers/authController');
const router = express.Router();

router.get('/register', formRegister);
router.post('/register', [
    body('UserName', 'Ingrese un nombre de Usuario valido').trim().notEmpty().escape(),
    body('Email', 'Ingrese un Email Valido').trim().isEmail().normalizeEmail(),
    body("Password", "Contraseña con 6 o más carácteres").trim().isLength({ min: 6 }).escape()
        .custom((value, { req }) => {
            if (value !== req.body.rePassword) {
                throw new Error("Password no coinciden");
            } else {
                return value;
            }
        }),
], registerUser);
router.get('/confirmar/:token', confirmarCuenta)
router.get('/login', formLogin);
router.post('/login', [
    body('Email', 'Ingrese un Email Valido').trim().isEmail().normalizeEmail(),
    body("Password", "Contraseña no cumple el formato")
        .trim()
        .isLength({ min: 4 })
        .escape(),
], loginUsuario);
router.get('/logout', cerrarSesion);

module.exports = router;