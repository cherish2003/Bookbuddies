const Book = require("../models/Book");
const User = require("../models/User");
const Request = require("../models/Request");

exports.createBook = async (req, res) => {
  try {
    console.log(req.body);
    const owner = await User.findById(req.body.ownerId);

    if (!owner || owner.role !== "owner") {
      return res.status(403).json({ error: "Only owners can list books" });
    }

    const book = new Book({
      ...req.body,
      owner: owner._id,
      available: true,
    });

    await book.save();
    res.status(201).json(book);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getBooks = async (req, res) => {
  try {
    const { search } = req.query;
    const filter = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { author: { $regex: search, $options: "i" } },
        { genre: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
        { contact: { $regex: search, $options: "i" } }, 
      ];
    }

    const books = await Book.find(filter)
      .populate("owner", "name email mobile")
      .populate({
        path: "currentRequest",
        populate: {
          path: "requester",
          select: "name email",
        },
      });

    res.json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.updateBook = async (req, res) => {
  try {
    const { ownerId, ...updateFields } = req.body;

    const owner = await User.findById(ownerId);
    if (!owner || owner.role !== "owner") {
      return res.status(403).json({ error: "Not authorized" });
    }

    const book = await Book.findOneAndUpdate(
      { _id: req.params.id, owner: owner._id },
      { $set: updateFields },
      { new: true }
    );

    if (!book) return res.status(403).json({ error: "Not authorized" });

    res.json(book);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    const owner = await User.findById(req.body.ownerId);

    if (
      !owner ||
      owner.role !== "owner" ||
      book.owner.toString() !== owner._id.toString()
    ) {
      return res.status(403).json({ error: "Not authorized" });
    }

    await Request.deleteMany({ book: book._id });

    await Book.findByIdAndDelete(req.params.id);
    res.json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getBorrowedBooks = async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log(userId);

    const acceptedRequests = await Request.find({
      requester: userId,
      status: "approved",
    }).populate("book");

    const borrowedBooks = acceptedRequests.map((req) => req.book);

    console.log(borrowedBooks, acceptedRequests);

    res.json(borrowedBooks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
