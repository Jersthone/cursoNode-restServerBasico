const { Router } = require('express');
const { check } = require('express-validator');



const { esRoleValido, existeEmail, existeUsuarioId } = require('../helpers/db-validators');


//Import controller
const { usuariosGet, usuariosPost, usuariosPut, usuariosDelete, usuariosPatch } = require('../controllers/usuarios.controller');

//Import middlewares
const { validarCampos, validarJWT, esAdminRole, tieneRole } = require('../middlewares');



const router = Router();

router.get('/', usuariosGet);

router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe tener al menos 6 letras').isLength({ min: 6 }),
    check('correo', 'El correo no es válido').isEmail(),
    check('rol').custom(esRoleValido),
    check('correo').custom(existeEmail),
    validarCampos
], usuariosPost);

router.put('/:id', [
    check('id', 'NO es un ID válido').isMongoId(),
    check('id').custom(existeUsuarioId),
    check('rol').custom(esRoleValido),
    validarCampos
], usuariosPut);

router.delete('/:id', [
    validarJWT,
    // esAdminRole,
    tieneRole('ADMIN_ROLE', 'VENTAS_ROLE'),
    check('id', 'NO es un ID válido').isMongoId(),
    check('id').custom(existeUsuarioId),
    validarCampos
], usuariosDelete);

router.patch('/', usuariosPatch);


module.exports = router;