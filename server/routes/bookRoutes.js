const express = require("express");
const router = express.Router();
const bookController = require("../controllers/bookController");

router.post("/", bookController.createBook);
router.get("/", bookController.getBooks);
router.patch("/:id", bookController.updateBook);
router.delete("/:id", bookController.deleteBook);
router.get("/borrowed/:userId", bookController.getBorrowedBooks);

module.exports = router;
