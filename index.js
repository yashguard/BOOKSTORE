const express = require("express");
const app = express();
app.use(express.json());
const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: String,
    author: String,
    category: String,
    publicationYear: Number,
    price: Number,
    quantity: Number,
    description: String,
    imageUrl: String,
  },
  { timestamps: true }
);

const check = (req, res, next) => {
  const {
    title,
    author,
    category,
    publicationYear,
    price,
    quantity,
    description,
    imageUrl,
  } = req.body;

  if (
    title ||
    author ||
    category ||
    publicationYear ||
    price ||
    quantity ||
    description ||
    imageUrl
  ) {
    return next();
  }
  res.status(400).json({ message: "All fields are required" });
};

const bookModel = mongoose.model("Book", bookSchema);

const connect = () => {
  mongoose
    .connect(
      "mongodb+srv://yashguard2002:j9Q5qzDP2nm5NIrM@cluster0.ter3ouq.mongodb.net/bookstore?retryWrites=true&w=majority"
    )
    .then((val) => {
      console.log("Connected to MongoDb server successfully");
    })
    .catch((err) => console.log("Error connecting to MongoDb server"));
};

app.get("/books/book/:id", async (req, res) => {
  const book = await bookModel.findById(req.params.id);
  res.status(200).send(book);
});

app.delete("/books/delete/:id", async (req, res) => {
  await bookModel.findByIdAndDelete(req.params.id);
  const book = await bookModel.find();
  res.status(200).send(book);
});

app.get("/books", async (req, res) => {
  const book = await bookModel.find();
  res.status(200).send(book);
});

app.patch("/books/update/:id", async (req, res) => {
  await bookModel.findByIdAndUpdate(req.params.id, req.body);
  const book = await bookModel.find();
  res.status(200).send(book);
});

app.get("/", (req, res) => {
  res.status(200).send("welcome to the book store");
});

app.post("/books/addbooks", check, async (req, res) => {
  const books = await bookModel.create(req.body);

  res.status(200).send(books);
});

app.get("/books/filter", async (req, res) => {
  const { author, category, title, price } = req.query;

  if (author) {
    const authorFilter = await bookModel.find({ author });
    res.status(200).send(authorFilter);
  }

  if (category) {
    const categoryFilter = await bookModel.find({ category });
    res.status(200).send(categoryFilter);
  }

  if (title) {
    const titleFilter = await bookModel.find({ title });
    res.status(200).send(titleFilter);
  }

  if (price) {
    if (price === "lth") {
      const lth = await bookModel.find().sort({ price: 1 });
      res.status(200).send(lth);
    } else if (price === "htl") {
      const htl = await bookModel.find().sort({ price: -1 });
      res.status(200).send(htl);
    }
  }

  //   const page = req.query.page || 1;
  //   const perPage = 10;
  //   const startIndex = (page - 1) * perPage;
  //   const endIndex = startIndex + perPage;
  //   const paginatedBooks = bookModel.find().slice(startIndex, endIndex);

  //   res.json(paginatedBooks);
});

app.listen(8090, () => {
  console.log("Listening on 8090");
  connect();
});
