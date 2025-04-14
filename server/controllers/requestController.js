const Book = require("../models/Book");
const User = require("../models/User");
const Request = require("../models/Request");

const createRequest = async (req, res) => {
  try {
    const { bookId, type, userId } = req.body;

    const book = await Book.findById(bookId);
    const user = await User.findById(userId);

    if (!book) return res.status(404).json({ error: "Book not found" });
    if (!user) return res.status(404).json({ error: "User not found" });
    if (!book.available) {
      return res.status(400).json({ error: "Book is not available" });
    }
    if (book.owner.toString() === userId.toString()) {
      return res.status(400).json({ error: "Cannot request your own book" });
    }

    const existingRequest = await Request.findOne({
      book: bookId,
      requester: userId,
      status: "pending",
    });

    if (existingRequest) {
      return res.status(400).json({ error: "Pending request already exists" });
    }

    const request = new Request({
      book: bookId,
      requester: userId,
      owner: book.owner,
      type: type || "rental",
      status: "pending",
    });

    await request.save();
    await Book.findByIdAndUpdate(bookId, {
      $push: { requests: request._id },
      $set: { status: "requested" },
    });

    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getBookRequests = async (req, res) => {
  try {
    const { ownerId } = req.params;

    const owner = await User.findById(ownerId);
    if (!owner || owner.role !== "owner") {
      return res.status(403).json({ error: "Only owners can view requests" });
    }

    const requests = await Request.find({ owner: ownerId })
      .populate("book", "title author coverImage")
      .populate("requester", "name email")
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const requestBook = async (req, res) => {
  try {
    const { bookId, type } = req.body;
    const userId = req.user._id;

    const book = await Book.findById(bookId);
    const user = await User.findById(userId);

    if (!book) return res.status(404).json({ error: "Book not found" });
    if (!user) return res.status(404).json({ error: "User not found" });
    if (!book.available)
      return res.status(400).json({ error: "Book is not available" });
    if (book.owner.toString() === userId.toString()) {
      return res
        .status(400)
        .json({ error: "You cannot request your own book" });
    }

    const existingRequest = await Request.findOne({
      book: bookId,
      requester: userId,
      status: "pending",
    });

    if (existingRequest) {
      return res.status(400).json({ error: "Pending request already exists" });
    }

    const request = new Request({
      book: bookId,
      requester: userId,
      owner: book.owner,
      status: "pending",
    });

    await request.save();
    await Book.findByIdAndUpdate(bookId, {
      $push: { requests: request._id },
      $set: { status: "requested", available: false },
    });

    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const respondToRequest = async (req, res) => {
  try {
    console.log(req.user);

    const { requestId } = req.params;
    const { status } = req.body;

    console.log(requestId);

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const request = await Request.findById(requestId);
    console.log("request", request);

    if (!request) return res.status(404).json({ error: "Request not found" });
    // if (request.owner.toString() !== req.user._id.toString()) {
    //   return res.status(403).json({ error: "Not authorized" });
    // }
    if (request.status !== "pending") {
      return res.status(400).json({ error: "Request already processed" });
    }

    request.status = status;
    await request.save();

    if (status === "approved") {
      await Book.findByIdAndUpdate(request.book, {
        requestedBy: request.requester,
        available: false,
        currentRequest: requestId,
        status: "exchanged",
      });
      await Request.updateMany(
        {
          book: request.book,
          status: "pending",
          _id: { $ne: requestId },
        },
        { $set: { status: "rejected" } }
      );
    } else {
      await Book.findByIdAndUpdate(request.book, {
        available: true,
        currentRequest: null,
        status: "available",
      });
    }

    res.json(request);
  } catch (error) {
    console.log(error);

    res.status(500).json({ error: error.message });
  }
};

const cancelRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.user._id;

    const request = await Request.findById(requestId);
    if (!request) return res.status(404).json({ error: "Request not found" });
    if (request.requester.toString() !== userId.toString()) {
      return res.status(403).json({ error: "Not authorized" });
    }
    if (request.status !== "pending") {
      return res.status(400).json({ error: "Cannot cancel processed request" });
    }

    request.status = "cancelled";
    await request.save();
    await Book.findByIdAndUpdate(request.book, {
      $pull: { requests: request._id },
    });

    res.json(request);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports = {
  createRequest,
  getBookRequests,
  requestBook,
  respondToRequest,
  cancelRequest,
};
