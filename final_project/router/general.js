const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (users.findIndex(user => user.username == username) != -1) {
    return res.status(400).json({ message: "Username already exists" });
  }

  users.push({ username, password }); // Store user (in memory for this example)
  return res.status(201).json({ message: "User registered successfully" }); // 201 Created
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(200).json(books); // Return all books
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    return res.status(200).json(book);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  const matchingBooks = Object.values(books).filter(book => book.author === author);

  if (matchingBooks.length > 0) {
    return res.status(200).json(matchingBooks);
  } else {
    return res.status(404).json({ message: "Books by this author not found" });
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  const matchingBooks = Object.values(books).filter(book => book.title === title);

  if (matchingBooks.length > 0) {
    return res.status(200).json(matchingBooks);
  } else {
    return res.status(404).json({ message: "Books with this title not found" });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book && book.reviews) {
    return res.status(200).json(book.reviews);
  } else {
    return res.status(404).json({ message: "Book or reviews not found" });
  }
});

// Get the book list available in the shop async
public_users.get('/books',async function (req, res) {
  //Write your code here
  try {
    const response = await axios.get('http://localhost:3000/books');
    const books = response.data;

    if (books) {
      return res.status(200).json(books);
    } else {
      return res.status(404).json({ message: "Books not found" }); // If the API doesn't return books
    }

  } catch (error) {
    console.error("Error fetching books:", error);
    return res.status(500).json({ message: "Error fetching books" }); // Handle API errors
  }
});

// Get book details based on ISBN async
public_users.get('books/isbn/:isbn', async (req, res) => {
  const isbn = req.params.isbn;

  try {
    const response = await axios.get(`http://localhost:3000/books/${isbn}`);
    const book = response.data;

    if (book) {
      return res.status(200).json(book);
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    console.error("Error fetching book by ISBN:", error);
    return res.status(500).json({ message: "Error fetching book" });
  }
});
  
// Get book details based on author async
public_users.get('books/author/:author', async (req, res) => {
  const author = req.params.author;

  try {
    const response = await axios.get(`http://localhost:3000/books?author=${author}`);
    const booksByAuthor = response.data;

    if (booksByAuthor && booksByAuthor.length > 0) {
      return res.status(200).json(booksByAuthor);
    } else {
      return res.status(404).json({ message: "Books by this author not found" });
    }
  } catch (error) {
    console.error("Error fetching books by author:", error);
    return res.status(500).json({ message: "Error fetching books" });
  }
});

// Get all books based on title async
public_users.get('books/title/:title', async (req, res) => {
  const title = req.params.title;

  try {
    const response = await axios.get(`http://localhost:3000/books?title=${title}`);
    const booksByTitle = response.data;

    if (booksByTitle && booksByTitle.length > 0) {
      return res.status(200).json(booksByTitle);
    } else {
      return res.status(404).json({ message: "Books with this title not found" });
    }
  } catch (error) {
    console.error("Error fetching books by title:", error);
    return res.status(500).json({ message: "Error fetching books" });
  }
});

module.exports.general = public_users;
