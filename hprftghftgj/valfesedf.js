const { body } = require('express-validator');

exports.validate_user = [
    body('email').isEmail().withMessage('please provide valid mail'),
    body('password').not().isEmpty().isLength({ min: 6, max: 12 }).withMessage('Password should be min 6 and max 10 character long')
    .matches('[0-9]').withMessage('Password should contain atleast one Number')
    .matches('[A-Z]').withMessage('Password should contain atleast One Caps')
    .matches('[~!@#$%^&*]').withMessage('Password should contain atleast One Symbol'),
]

