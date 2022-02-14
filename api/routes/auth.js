const router = require("express").Router();
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const { users } = require("../database");
const  verusLogin  = require("../utils/loginVerus");
const {checkLogin}  = require("../utils/checkLogin");
const {checkUser}  = require("../utils/database");

const {
  LOGIN_FAIL,
  SIGNATURE_OK,
  SIGNATURE_INVALID,
} = require("../constants/componentConstants");

require("dotenv").config();

// Sign up
router.post(
  "/signup",
  [
    check("email", "Invalid email").isEmail(),
    check("password", "Password must be at least 6 chars long").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const { email, password } = req.body;

    // Validate user input
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    // Validate if user already exists
    let user = users.find((user) => {
      return user.email === email;
    });

    if (user) {
      // 422 Unprocessable Entity: server understands the content type of the request entity
      // 200 Ok: Gmail, Facebook, Amazon, Twitter are returning 200 for user already exists
      return res.status(200).json({
        errors: [
          {
            email: user.email,
            msg: "The user already exists",
          },
        ],
      });
    }

    // Hash password before saving to database
    const salt = await bcrypt.genSalt(10);
    console.log("salt:", salt);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log("hashed password:", hashedPassword);

    // Save email and password to database/array
    users.push({
      email,
      password: hashedPassword,
    });

    // Do not include sensitive information in JWT
    const accessToken = await JWT.sign(
      { email },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "1m",
      }
    );

    res.json({
      accessToken,
    });
  }
);

// Error status code
// 401 Unauthorized: it’s for authentication, not authorization. Server says "you're not authenticated".
// 403 Forbidden: it's for authorization. Server says "I know who you are,
//                but you just don’t have permission to access this resource".

///////////////////////////

// Get all users
router.get("/users", (req, res) => {
  res.json(users);
});

// Get Verus Login consent challenge

router.get("/challenge", (req, res) => {

  verusLogin().then((result) => res.json(result));

});

// Log in
router.post("/login", async (req, res) => {
  const challenge = req.body;

  // Check user has signed with the correct ID

  const {result, data} = await checkLogin(challenge);

  if(result == SIGNATURE_INVALID){
    return res.status(400).json({
      loginOption: LOGIN_FAIL,
      errors: [
        {
          msg: "Invalid signature for ID",
        },
      ],
    });
  }

  // Check correct JWT signed response
  let user ={};
  try {
      user = await JWT.verify(
      data.decision?.request.challenge.login_challenge,
      process.env.TOKEN_KEY
    );
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }

  // Check uuid in challenge is correct
  if (user.uuid != data.decision?.request.challenge.uuid) {
    return res.status(400).json({
      loginOption: LOGIN_FAIL,
      errors: [
        {
          msg: "Incorrect JWT Token",
        },
      ],
    });
  }

  // See if user is registered or not
  const userFound = await checkUser(data.signing_id);
  console.log("User found?: ", userFound)
  

  // Send new JWT access token
  const accessToken = await JWT.sign(
    { id: data.signing_id },
    process.env.TOKEN_KEY,
    {
      expiresIn: "1m",
    }
  );

  // Refresh token
  const refreshToken = await JWT.sign(
    { id: data.signing_id },
    process.env.ACCESS_TOKEN_KEY,
    {
      expiresIn: "5m",
    }
  );

  // Set refresh token in refreshTokens array
  refreshTokens.push(refreshToken);

  res.json({
    registered: userFound,
    accessToken,
    refreshToken,
  });
});

let refreshTokens = [];

// Create new access token from refresh token
router.post("/token", async (req, res) => {
  const refreshToken = req.header("x-auth-token");

  // If token is not provided, send error message
  if (!refreshToken) {
    res.status(401).json({
      errors: [
        {
          msg: "Token not found",
        },
      ],
    });
  }

  // If token does not exist, send error message
  if (!refreshTokens.includes(refreshToken)) {
    res.status(403).json({
      errors: [
        {
          msg: "Invalid refresh token",
        },
      ],
    });
  }

  try {
    const user = await JWT.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    // user = { email: 'jame@gmail.com', iat: 1633586290, exp: 1633586350 }
    const { email } = user;
    const accessToken = await JWT.sign(
      { email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1m" }
    );
    res.json({ accessToken });
  } catch (error) {
    res.status(403).json({
      errors: [
        {
          msg: "Invalid token",
        },
      ],
    });
  }
});

// Deauthenticate - log out
// Delete refresh token
router.delete("/logout", (req, res) => {
  const refreshToken = req.header("x-auth-token");

  refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
  res.sendStatus(204);
});

module.exports = router;
