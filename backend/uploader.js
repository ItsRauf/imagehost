import crypto from "crypto"
import multer from "multer"

import { getUser, verifyToken } from "./models/User.Model.js"

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: async (req, file, next) => {
    const token = req.headers.authorization
    const verified = await verifyToken(token).catch((err) => {
      if (err) res.status(500).json(err)
    })
    const user = await getUser(verified.id).catch((err) => {
      if (err) res.status(500).json(err)
    })
    req.user = user
    next(null, `${__dirname}/uploads/${user.id}`);
  },
  filename: (req, file, next) => {
    const mimeArr = file.mimetype.split("/");
    const ext = mimeArr[mimeArr.length - 1];
    const fileName = crypto.randomBytes(3).toString("hex");
    next(null, `${fileName}.${ext}`);
  }
})
const uploader = multer({ storage })

export default uploader