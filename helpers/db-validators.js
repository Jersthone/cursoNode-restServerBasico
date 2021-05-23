const Role = require('../models/role.model');
const Usuario = require('../models/usuario.model');

const esRoleValido = async(rol = '') => {
    const existeRol = await Role.findOne({ rol });
    if (!existeRol) {
        throw new Error(`El rol ${rol} no es un rol valido`);
    }
}

const existeEmail = async(correo = '') => {
    const validarEmail = await Usuario.findOne({ correo });
    if (validarEmail) {
        throw new Error(`El correo: ${correo} ya esta registrado`);
    }
}

const existeUsuarioId = async(id) => {
    const existeUsuario = await Usuario.findById(id);
    if (!existeUsuario) {
        throw new Error(`El id: ${id} no existe`);
    }
}

module.exports = {
    esRoleValido,
    existeEmail,
    existeUsuarioId
}