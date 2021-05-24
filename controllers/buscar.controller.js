const { response } = require("express");
const { ObjectId } = require('mongoose').Types;
const { Usuario, Producto, Categoria } = require('../models');

const coleccionesPermitidas = [
    'categorias',
    'productos',
    'usuarios',
    'productosporcategoria'
];

const buscarUsuarios = async(termino = '', res = response) => {

    const esMongoID = ObjectId.isValid(termino);

    if (esMongoID) {
        const usuario = await Usuario.findById(termino);
        return res.json({
            results: (usuario) ? [usuario] : []
        });
    }

    const regex = new RegExp(termino, 'i');

    const usuarios = await Usuario.find({
        $or: [{ nombre: regex }, { correo: regex }],
        $and: [{ estado: true }]
    });

    res.json({
        results: usuarios
    });
}

const buscarCategorias = async(termino = '', res = response) => {

    const esMongoID = ObjectId.isValid(termino);

    if (esMongoID) {
        const categoria = await Categoria.findById(termino);
        return res.json({
            results: (categoria) ? [categoria] : []
        });
    }

    const regex = new RegExp(termino, 'i');

    const categorias = await Categoria.find({ nombre: regex });

    res.json({
        results: categorias
    });
}

const buscarProductos = async(termino = '', res = response) => {

    const esMongoID = ObjectId.isValid(termino);

    if (esMongoID) {
        const producto = await Producto.findById(termino).populate('categoria', 'nombre');
        return res.json({
            results: (producto) ? [producto] : []
        });
    }

    const regex = new RegExp(termino, 'i');

    const productos = await Producto.find({ nombre: regex, estado: true }).populate('categoria', 'nombre');

    res.json({
        results: productos
    });
}

const buscarProductosPorCategoria = async(termino = '', res = response) => {

    const esMongoID = ObjectId.isValid(termino);

    //Buscar ProductosPorCategoria por id categoria
    if (esMongoID) {
        const productos = await Producto.find({ categoria: termino }).populate('categoria', 'nombre');
        return res.json({
            results: (productos) ? [productos] : []
        });
    }

    // Buscar ProductosPorCategoria por nombre categoria
    const regex = new RegExp(termino, 'i');
    const categorias = await Categoria.find({ nombre: regex });
    const productos = await Producto.find({ categoria: categorias[0]._id }).populate('categoria', 'nombre');

    res.json({
        results: productos
    });
}

const buscar = (req, res = response) => {

    const { coleccion, termino } = req.params;

    if (!coleccionesPermitidas.includes(coleccion)) {
        return res.status(400).json({
            msg: `Las colecciones permitidas son ${coleccionesPermitidas}`
        });
    }

    switch (coleccion) {
        case 'categorias':
            buscarCategorias(termino, res);
            break;
        case 'productos':
            buscarProductos(termino, res);
            break;
        case 'usuarios':
            buscarUsuarios(termino, res);
            break;
        case 'productosporcategoria':
            buscarProductosPorCategoria(termino, res);
            break;
        default:
            res.status(500).json({
                msg: 'Se me olvido esta busqueda'
            });
    }
}

module.exports = {
    buscar
}