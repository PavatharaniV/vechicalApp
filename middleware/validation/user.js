const { check, validationResult } = require('express-validator');

exports.validateUserSignUp = [
    check('name')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Name is required!')
      .isString()
      .withMessage('Must be a valid name!')
      .isLength({ min: 3, max: 20 })
      .withMessage('Name must be witin 3 to 20 characters'),
    check('email')
      .normalizeEmail()
      .isEmail()
      .withMessage('Invalid email'),
    check('password')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Password is empty')
      .isLength({ min: 8, max: 20 })
      .withMessage('password must be 8 to 20 characters'),
    check('confirmPassword')
      .trim()
      .not()
      .isEmpty()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Both password must be same!');
        }
        return true;
    }),
]

exports.userValidation = (req, res, next) => {
    const result = validationResult(req).array();
   // console.log(result);
    if (!result.length) return next();

    const error = result[0].msg;
    res.json({ success: false, message: error });
}

exports.validateUserSignIn = [
    check('email').trim().isEmail().withMessage(' email/password is required '),
    check('password').trim().not().isEmpty().withMessage('email/password is required'),
]