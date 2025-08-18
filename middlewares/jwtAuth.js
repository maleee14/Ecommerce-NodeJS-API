import jwt from "jsonwebtoken";

const jwtAuth = () => {
  return async (req, res, next) => {
    try {
      if (!req.headers.authorization) {
        throw { code: 400, message: "UNAUTHORIZED" };
      }

      const token = req.headers.authorization.split(" ")[1];
      const verify = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);
      req.jwt = verify;

      next();
    } catch (error) {
      const errorJwt = [
        "invalid signature",
        "jwt malformed",
        "jwt must be provided",
        "invalid token",
      ];

      if (error.message == "jwt expired") {
        error.code = 401;
        error.message = "ACCESS_TOKEN_EXPIRED";
      } else if (errorJwt.includes(error.message)) {
        error.message = "INVALID_ACCESS_TOKEN";
      }
      return res.status(error.code || 500).json({
        status: false,
        message: error.message,
      });
    }
  };
};

export default jwtAuth;
