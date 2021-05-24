const { response, request } = require("express");
const { Producto } = require('../models');

// ObtenerProducto - paginado - total - populate
const obtenerProductos = async(req = request, res = response) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    if (isNaN(limite) || isNaN(desde)) {
        const Nan = "Limite y desde deben ser un numero";
        res.json({
            Nan
        });
    }

    const [total, productos] = await Promise.all([
        Producto.countDocuments(query),

        Producto.find(query)
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre')
        .skip(Number(desde))
        .limit(Number(limite))
    ]);

    res.json({
        total,
        productos
    });
}

// ObtenerProducto  - populate {}
const obtenerProducto = async(req, res = response) => {

    const { id } = req.params;
    const productos =
        await Producto.findById(id)
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre');

    res.json(productos);
}

//CrearProducto 
const crearProducto = async(req, res = response) => {

    const { estado, usuario, ...body } = req.body;

    const productoDB = await Producto.findOne({ nombre: body.nombre });

    if (productoDB) {
        return res.status(400).json({
            msg: `El producto ${productoDB.nombre}, ya existe`
        });
    }

    //Generar la data a guardar
    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        usuario: req.usuario._id
    }
    const producto = new Producto(data);

    //Guardar DB
    await producto.save();

    res.status(201).json(producto);
}

// Actualizar Producto  
const actualizarProducto = async(req, res) => {

    const { id } = req.params;
    const { _id, estado, usuario, ...data } = req.body;

    if (data.nombre) {
        data.nombre = data.nombre.toUpperCase();

        const productoDB = await Producto.findOne({ nombre: body.nombre });
        if (productoDB) {
            return res.status(400).json({
                msg: `La categoria ${productoDB.nombre}, ya existe`
            });
        }
    }
    data.usuario = req.usuario._id;

    const producto = await Producto.findByIdAndUpdate(id, data, { new: true });
    res.json({
        producto
    });
}

// Borrar Producto - estado: false
const borrarProducto = async(req, res = response) => {
    const { id } = req.params;

    const productoBorrado = await Producto.findByIdAndUpdate(id, { estado: false }, { new: true });

    res.json({
        productoBorrado
    });
}

module.exports = {
    crearProducto,
    obtenerProducto,
    obtenerProductos,
    actualizarProducto,
    borrarProducto
}