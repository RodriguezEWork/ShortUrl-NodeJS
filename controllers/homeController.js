const Url = require('../models/Url');
const { nanoid } = require('nanoid');

const leerUrls = async (req, res) => {
    try {
        const urls = await Url.find({ user: req.user.id }).lean();
        res.render('home', { urls: urls, mensajes: req.flash('mensajes'), user: req.user });
    } catch (error) {
        req.flash('mensajes', [{ msg: 'Hubo un fallo...' }]);
        return res.redirect('/')
    }
};

const agregarUrl = async (req, res) => {

    const { origin } = req.body;

    try {
        const url = new Url({ origin: origin, shortUrl: nanoid(8), user: req.user.id });
        await url.save();
        req.flash('mensajes', [{ msg: 'URL Agregada' }]);
        res.redirect('/');
    } catch (error) {
        req.flash('mensajes', [{ msg: 'Hubo un fallo...' }]);
        return res.redirect('/')
    }

};

const eliminarUrl = async (req, res) => {

    const { id } = req.params;

    try {
        const url = await Url.findById(id);
        if (!url.user.equals(req.user.id)) {
            throw new Error('Este link no te corresponde');
        }
        await url.remove();
        req.flash("mensajes", [{ msg: "se eliminó url correctamente" }]);
        res.redirect('/');
    } catch (error) {
        req.flash('mensajes', [{ msg: 'Hubo un fallo...' }]);
        return res.redirect('/')
    }

};

const editarUrlForm = async (req, res) => {
    const { id } = req.params;
    const { origin } = req.body;
    try {
        const url = await Url.findById(id);
        if (!url.user.equals(req.user.id)) {
            throw new Error("no se puede editar url");
        }
        await url.updateOne({ origin });
        req.flash("mensajes", [{ msg: "se editó url correctamente" }]);
        res.redirect("/");
    } catch (error) {
        req.flash("mensajes", [{ msg: error.message }]);
        return res.redirect("/");
    }
};

const editarUrl = async (req, res) => {
    const { id } = req.params;
    try {
        const urlDB = await Url.findById(id).lean();
        if (!urlDB.user.equals(req.user.id)) {
            throw new Error("no se puede editar url");
        }
        return res.render("home", { urlDB: urlDB, user: req.user });
    } catch (error) {
        req.flash("mensajes", [{ msg: error.message }]);
        return res.redirect("/");
    }
};

const redireccionamiento = async (req, res) => {
    const { shortURL } = req.params;
    try {
        const urlDB = await Url.findOne({ shortURL: shortURL });
        if (!urlDB) throw new Error("404 no se encuentra la url");
        return res.redirect(urlDB.origin);
    } catch (error) {
        req.flash("mensajes", [{ msg: error.message }]);
        return res.redirect("/");
    }
};



module.exports = {
    leerUrls,
    agregarUrl,
    eliminarUrl,
    editarUrl,
    editarUrlForm,
    redireccionamiento,
};