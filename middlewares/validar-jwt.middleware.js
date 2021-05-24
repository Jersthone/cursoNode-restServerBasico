const { response, request } = require('express');
const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario.model');

const validarJWT = async(req = request, res = response, next) => {

    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            msg: "Se necesita un token de acceso para realizar esta función"
        });
    }

    try {

        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        //Obtener el usuario actual
        const usuario = await Usuario.findById(uid);
        req.usuario = usuario;

        if (!usuario) {
            return res.status(401).json({
                msg: 'Token no válido'
            });
        }

        //Verificar si el usuario esta activo
        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'Token no válido'
            });
        }

        next();
    } catch (error) {

        console.log(error);
        return res.status(401).json({
            msg: "Token no válido"
        });
    }

}

module.exports = {
    validarJWT
}