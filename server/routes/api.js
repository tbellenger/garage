import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { Gpio } from "onoff";

var router = Router();

let toggleDoor = (door) => {
  door.writeSync(1);
  setTimeout(() => {
    door.writeSync(0);
  }, 500);
};

/* POST open. */
router.post(
  "/toggle/:doorId",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    console.log(req.user.id);
    let door1;
    let door2;

    if (Gpio.accessible) {
      door1 = new Gpio(17, "out");
      door2 = new Gpio(27, "out");
    } else {
      door1 = {
        writeSync: (value) => {
          console.log("virtual led now uses value " + value);
        },
      };
      door2 = {
        writeSync: (value) => {
          console.log("virtual led now uses value " + value);
        },
      };
    }
    switch (req.params.doorId) {
      case "1":
        toggleDoor(door1);
        res.json("{'message':'success'}");
        break;
      case "2":
        toggleDoor(door2);
        res.json("{'message':'success'}");
        break;
      default:
        res.json("{'error':'door does not exist'}");
    }
  }
);

router.post(
  "/isopen",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    res.json("{'message':'success', 'isOpen':true}");
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
