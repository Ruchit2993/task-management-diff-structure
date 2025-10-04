import express from "express";
import {getAllUsers,getUserById,updateUser,patchUser,deleteUser} from "./user.controller.js";
import { verifyToken, isAdmin } from "../../helper/middlewares/auth.middleware.js";
import { register } from "../auth/auth.controller.js";

const router = express.Router();

router.get("/", verifyToken, isAdmin, getAllUsers);
router.get("/:id", verifyToken, getUserById);
router.post("/", verifyToken, isAdmin, register); // reuse register from auth
router.put("/:id", verifyToken, isAdmin, updateUser);
router.patch("/:id", verifyToken, isAdmin, patchUser);
router.delete("/:id", verifyToken, isAdmin, deleteUser);

export default router;
