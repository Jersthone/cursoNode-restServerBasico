const validarCampos = require('../middlewares/validar-campos.middleware');
const validarJWT = require('../middlewares/validar-jwt.middleware');
const validaRoles = require('../middlewares/validar-roles.middleware');
const validarArchivo = require('../middlewares/validar-archivo.middleware');

module.exports = {
    ...validarCampos,
    ...validarJWT,
    ...validaRoles,
    ...validarArchivo
}