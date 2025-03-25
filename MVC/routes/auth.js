// routes/auth.js
const express = require("express");
const router = express.Router();

const { validatorRegister, validatorLogin } = require("../validators/auth");
const { registerCtrl, loginCtrl } = require("../controllers/auth");


/**
 * @openapi
 * /api/auth/register:
 *  post:
 *      tags:
 *      - User
 *      summary: "User registter"
 *      description: Register a new user
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: "#/components/schemas/user"
 *      responses:
 *          '200':
 *              description: Returns the inserted object
 *          '401':
 *              description: Validation error
 *      security:
 *          - bearerAuth: []
 */


// Ruta para registrar
router.post("/register", validatorRegister, registerCtrl);

// * @openapi
//  * /api/auth/login:
//  *  post:
//  *      tags:
//  *      - User
//  *      summary: "User login"
//  *      description: Login a user
//  *      requestBody:
//  *          content:
//  *              application/json:
//  *                  schema:
//  *                      $ref: "#/components/schemas/login"
//  *      responses:
//  *          '200':
//  *              description: Returns the token
//  *          '401':
//  *              description: Validation error
//  *      security:
//  *          - bearerAuth: []
//  */


// Ruta para login
router.post("/login", validatorLogin, loginCtrl);

module.exports = router;
