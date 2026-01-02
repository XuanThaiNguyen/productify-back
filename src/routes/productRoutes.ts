import { Router } from "express";
import { requireAuth } from "@clerk/express";
import * as productController from "../controllers/productController";

const router = Router();

router.get("/", productController.getAllProducts);
router.get("/my", requireAuth, productController.getMyProducts);
router.get("/:id", productController.getProductById);
router.post("/", requireAuth, productController.createProduct);
router.put("/:id", requireAuth, productController.updateProduct);
router.delete("/:id", requireAuth, productController.deleteProduct);

export default router;
