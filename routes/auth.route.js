import { Router } from 'express';
import { infoUser, login, register, refreshToken, logout } from '../controllers/auth.controller.js';
import { body } from "express-validator";
import { validationResultExpress } from '../middlewares/validationResultsExpress.js';
import { requireToken } from '../middlewares/requireToken.js';

const router = Router();

router.post(
    '/register',
    [
        body("email", "Formato incorrecto")
            .trim()
            .isEmail()
            .normalizeEmail(),
        body("password", "Minimo 6 caracteres")
            .trim()
            .isLength({ min: 6 }),
        body("password", "formato Password Incorrecto")
            .custom((value, { req }) => {
                if (value != req.body.repassword) {
                    throw new Error("No coinciden las contraseñas");
                }
                return value;
            })
    ],
    validationResultExpress,
    register
);
router.post('/login', [
    body("email", "Formato incorrecto")
        .trim()
        .isEmail()
        .normalizeEmail(),
    body("password", "Minimo 6 caracteres")
        .trim()
        .isLength({ min: 6 }),
],
    validationResultExpress,
    login
);

router.get("/protected", requireToken, infoUser)
router.get("/refresh", refreshToken)
router.get("/logout", logout);

export default router;