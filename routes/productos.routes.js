const { Router } = require('express');
const { check } = require('express-validator');


const { validarCampos, validarJWT, esAdminRole } = require('../middlewares');
const { crearProducto, obtenerProducto, obtenerProductos, actualizarProducto, borrarProducto } = require('../controllers/productos.controller');
const { existeCategoriaId, existeProductoId } = require('../helpers/db-validators');

const router = Router();

//Obtener todos los productos - publico
router.get('/', obtenerProductos);

//Obtener un producto por id - publico
router.get('/:id', [
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom(existeProductoId),
    validarCampos
], obtenerProducto);

//Crear un producto - privado - necesita token
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'La categoria no tiene una id de Mongo válida').isMongoId(),
    check('categoria').custom(existeCategoriaId),
    validarCampos
], crearProducto);

//Actualizar una categoria por id - privado - necesita token
router.put('/:id', [
    validarJWT,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom(existeProductoId),
    validarCampos
], actualizarProducto);

//Borrar una categoria por id - privado - admin y token
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom(existeProductoId),
    validarCampos
], borrarProducto);


module.exports = router;