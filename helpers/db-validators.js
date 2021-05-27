const { Usuario, Role, Categoria, Producto } = require('../models');

// Validaciones Rol
const esRoleValido = async(rol = '') => {
    const existeRol = await Role.findOne({ rol });
    if (!existeRol) {
        throw new Error(`El rol ${rol} no es un rol valido`);
    }
}

// Validaciones Usuario
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

// Validaciones Categorias
const existeCategoriaId = async(id) => {
    const existecategoria = await Categoria.findById(id);
    if (!existecategoria) {
        throw new Error(`La categoria con id: ${id} no existe`);
    }
}

// Validaciones Categorias
const existeProductoId = async(id) => {
    const existeproducto = await Producto.findById(id);
    if (!existeproducto) {
        throw new Error(`La producto con id: ${id} no existe`);
    }
}

//Validar colecciones permitidas
const coleccionesPermitidas = (coleccion = '', colecciones = []) => {

    const incluida = colecciones.includes(coleccion);
    if (!incluida) {
        throw new Error(`La coleccion: ${coleccion} no esta permitida. Prube con ${colecciones}`);
    }

    return true;
}

module.exports = {
    esRoleValido,
    existeEmail,
    existeUsuarioId,
    existeCategoriaId,
    existeProductoId,
    coleccionesPermitidas
}