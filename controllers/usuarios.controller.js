const { response, request } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario.model');


const usuariosGet = async(req = request, res = response) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    if (isNaN(limite) || isNaN(desde)) {
        const Nan = "Limite y desde deben ser un numero";
        res.json({
            Nan
        });
    }
    // const usuarios = await Usuario.find(query)
    //     .skip(Number(desde))
    //     .limit(Number(limite));

    // const total = await Usuario.countDocuments(query);

    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),

        Usuario.find(query)
        .skip(Number(desde))
        .limit(Number(limite))
    ]);

    res.json({
        total,
        usuarios
    });
}

const usuariosPost = async(req, res = response) => {

    const { nombre, correo, password, rol } = req.body;
    const usuario = new Usuario({ nombre, correo, password, rol });

    //Encriptar contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);

    //Guardar en BD
    await usuario.save();

    res.json({
        usuario
    });
}



const usuariosPut = async(req, res) => {

    const { id } = req.params;
    const { _id, password, google, correo, ...resto } = req.body;

    if (password) {
        //Encriptar contraseña
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto);
    res.json({
        usuario
    });
}

const usuariosDelete = async(req, res = response) => {
    const { id } = req.params;

    //Borrar Fisicamente
    // const usuario = await Usuario.findByIdAndDelete(id);

    //Cambiar el estado del usuario
    const usuario = await Usuario.findByIdAndUpdate(id, { estado: false });
    const usuarioAuth = req.usuario;
    res.json({
        usuario,
        usuarioAuth
    });
}
const usuariosPatch = (req, res) => {
    res.json({
        msg: 'patch api - controlador'
    });
}

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosDelete,
    usuariosPatch
}