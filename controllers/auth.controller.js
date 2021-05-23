const { response } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario.model');

const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');

const login = async(req, res = response) => {

    const { correo, password } = req.body;

    try {

        //Verificar si el email existe
        const usuario = await Usuario.findOne({ correo });

        if (!usuario) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos'
            });
        }

        //Verificar si el usuario esta activo
        if (!usuario.estado) {
            return res.status(400).json({
                msg: 'El usuario esta desactivado. Contacte con el administrador'
            });
        }

        //Verificar la contraseña
        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if (!validPassword) {
            return res.status(400).json({
                msg: 'Contraseña incorrecta'
            });
        }

        //Generar JWT + transformar callback en promesa
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Contacte con el administrador'
        });
    }
}

const googleSingIn = async(req, res = response) => {


    const { id_token } = req.body;
    try {

        const { correo, nombre, img } = await googleVerify(id_token);

        //Verificar si el correo existe en la bd
        let usuario = await Usuario.findOne({ correo });
        if (!usuario) {
            //Si no existe se debe crear
            const data = {
                nombre,
                correo,
                password: ':P',
                img,
                google: true
            };
            usuario = new Usuario(data);
            await usuario.save();
        }

        //Si el usuario en DB esta desactivado
        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'Usuario bloqueado'
            });
        }

        //Generar el JWT
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        });
    } catch (error) {
        res.status(400).json({
            msg: 'Token de google no valido',
            id_token
        });
    }

}

module.exports = {
    login,
    googleSingIn
}