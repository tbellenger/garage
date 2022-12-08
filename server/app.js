import express from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";
import { URL } from "url";

import "./auth/auth.js";
import indexRouter from "./routes/index.js";
import apiRouter from "./routes/api.js";

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  express.static(new URL("../build", import.meta.url).pathname.substring(1))
);

app.use("/", indexRouter);
app.use("/api", apiRouter);

export default app;
