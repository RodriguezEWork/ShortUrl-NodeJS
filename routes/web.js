const express = require('express');
const { leerUrls, agregarUrl, eliminarUrl, editarUrl, editarUrlForm, redireccionamiento } = require('../controllers/homeController');
const { formPerfil, editarFoto } = require('../controllers/perfilController');
const urlValidar = require('../middlewares/urlValidate');
const validacion = require("../middlewares/validarUser");
const router = express.Router();

router.get('/', validacion, leerUrls);
router.post('/', validacion, urlValidar, agregarUrl);
router.get('/eliminar/:id', validacion, eliminarUrl);
router.get('/editar/:id', validacion, editarUrl);
router.post('/editar/:id', validacion, urlValidar, editarUrlForm);
router.get('/perfil', validacion, formPerfil);
router.post('/perfil', validacion, editarFoto);
router.get("/:shortURL", redireccionamiento);

module.exports = router;