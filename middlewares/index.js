const validarCampos = require('../middlewares/validar-campos.middleware');
const validarJWT = require('../middlewares/validar-jwt.middleware');
const validaRoles = require('../middlewares/validar-roles.middleware');

module.exports = {
    ...validarCampos,
    ...validarJWT,
    ...validaRoles
}