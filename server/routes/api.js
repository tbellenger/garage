import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
var router = Router();

/* POST open. */
router.post(
  "/toggle",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    console.log(req.user.id);
    res.json("{'message':'success'}");
  }
);

router.post(
  "/status",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    res.json("{'message':'success', 'status':'open'}");
  }
);

router.post("/code", async (req, res, next) => {
  passport.authenticate("login", async (err, user, info) => {
    try {
      if (err || !user) {
        return res.status(401).json("{'message':'error'}");
      }
      req.login(user, { session: false }, async (error) => {
        if (error) {
          return next(error);
        }
        const body = { id: user.id, email: user.email };
        const token = jwt.sign({ user: body }, process.env.JWT_SECRET);
        return res.json({ jwt: token });
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
});

export default router;