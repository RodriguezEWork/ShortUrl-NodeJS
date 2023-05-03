const formidable = require('formidable');
const path = require('path');
const jimp = require('jimp');
const fs = require('fs');
const User = require('../models/User');

const formPerfil = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        return res.render('perfil', { mensajes: req.flash('mensajes'), user: req.user, imagen: user.imagen });
    } catch (error) {
        req.flash("mensajes", [{ msg: "no se puede leer perfil" }]);
        return res.redirect("/perfil");
    }
}

const editarFoto = async (req, res) => {

    const form = new formidable.IncomingForm();
    form.maxFileSize = 50 * 1024 * 1024;

    form.parse(req, async (err, fields, files) => {

        const file = files.myFile;
        const imageTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/gif",
        ];

        try {

            if (err) {
                throw new Error('Existen errores xD');
            }

            if (file.originalFilename === '') {
                throw new Error('Por favor agregue una imagen');
            }

            if (!imageTypes.includes(file.mimetype)) {
                throw new Error("Por favor agrega una imagen .jpg o png");
            }

            if (file.size > 50 * 1024 * 1024) {
                throw new Error('Debe ser menor a 5mb');
            }

            const extension = file.mimetype.split('/')[1];
            const dirFile = path.join(
                __dirname,
                `../public/img/perfiles/${req.user.id}.${extension}`
            );

            fs.renameSync(file.filepath, dirFile);

            const image = await jimp.read(dirFile);
            image.resize(200, 200).quality(90).writeAsync(dirFile);

            const user = await User.findById(req.user.id);
            user.imagen = `${req.user.id}.${extension}`;

            await user.save();

            req.flash('mensajes', [{ msg: 'Ya se subio' }]);

        } catch (error) {
            req.flash('mensajes', [{ msg: error.message }]);
        } finally {
            return res.redirect('/perfil')
        }

    })

}

module.exports = {
    formPerfil,
    editarFoto
}