const express = require("express");
const router = express.Router();
const requestController = require("../controllers/requestController");

router.post("/", requestController.createRequest);

router.get("/owner/:ownerId", requestController.getBookRequests);

router.patch("/:requestId/respond", requestController.respondToRequest);

router.patch("/:requestId/cancel", requestController.cancelRequest);
router.patch("/:id/request", requestController.requestBook);

module.exports = router;
