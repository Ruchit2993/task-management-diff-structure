import express from "express";
import {getAllStatuses,getStatusByCode,createStatus,updateStatus,patchStatus,deleteStatus} from "./status-master.controller.js";
import { verifyToken, isAdmin } from "../../helper/middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", verifyToken, getAllStatuses);
router.get("/:id", verifyToken, getStatusByCode);
router.post("/", verifyToken, isAdmin, createStatus);
router.put("/:code", verifyToken, isAdmin, updateStatus);
router.patch("/:code", verifyToken, isAdmin, patchStatus);
router.delete("/:code", verifyToken, isAdmin, deleteStatus);

export default router;
