import axios from "axios";
import { validationResult, body, param } from "express-validator";

export const validationResultExpress = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

export const paramLinkValidator = [
    param("id", "Formato no validado(EV)").trim().notEmpty().escape(),
    validationResultExpress
]

export const bodyLinkValidator = [
    body("longLink", "formato link incorrecto")
        .trim().notEmpty()
        .custom(async (value) => {
            try {
                if (!value.startsWith("https://")) {
                    value = "https://" + value;
                }
                await axios.get(value);
                console.log("hola desde aqui");

                return value;
            } catch (error) {
                throw new Error("not found longLink 404");
            }
        }),
    validationResultExpress
]

export const bodyRegisterValidator = [
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
        }),
    validationResultExpress
]

export const bodyLoginValidator = [
    body("email", "Formato incorrecto")
        .trim()
        .isEmail()
        .normalizeEmail(),
    body("password", "Minimo 6 caracteres")
        .trim()
        .isLength({ min: 6 }),
    validationResultExpress,
]
