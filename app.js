import express from "express";
import logger from "morgan";
import cors from "cors";
import path from "path";
import contactsRouter from "./routes/api/contactsRouter.js";
import authRoter from "./routes/api/authRoute.js";
export const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";
const __dirname = path.dirname(new URL(import.meta.url).pathname);
app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use("/api/contacts", contactsRouter);
app.use("/api/user", authRoter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});
