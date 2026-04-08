const express = require("express");
const { createLink, getMyLinks } = require("../controllers/link.controller");
const { authenticate } = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/", authenticate, createLink);
router.get("/my", authenticate, getMyLinks);

module.exports = router;
