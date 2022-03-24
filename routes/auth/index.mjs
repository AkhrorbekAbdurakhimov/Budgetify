import express from "express";
import jwt from "jsonwebtoken";

import { loginSchema } from "./schema.mjs";
import { catchReject } from "./../../utils/helper.mjs";
import config from "./../../config/index.mjs";
import Users from "./../../database/users.mjs";

const router = express.Router();

const login = catchReject(async (req, res, next) => {
  const { error, value } = loginSchema.validate(req.body);
  
  if (error) 
    return next({
      status: 400,
      message: error.details[0].message
    })
    
  const result = await Users.login(value);
  
  if (result.length) {
    const user = result[0];
    const accessToken = jwt.sign({ user }, config.JWT.sercetKey, { expiresIn: config.JWT.expiresIn });
    return res.status(200).send({
      message: "You are logged in successfully",
      token: accessToken,
      user
    })
  } else {
    return res.status(404).send({
      message: "User not found, invalid email or password"
    })
  }
})

router.post('/login', login);

export default router;