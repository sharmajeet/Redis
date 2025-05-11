const Book = require('../models/books');
const client = require('../config/RedisClient');

const getAllBooks = async (req, res) => {
    try {

        //first we check the redis cache if books are available or not
        const cachedBooks = await client.get('books');
        if (cachedBooks) {
            const books = JSON.parse(cachedBooks);
            console.log("Books fetched from cache");
            return res.status(200).json({ message: "Books fetched from cache", books });
        }

        // If not in cache, fetch from database
        const bookCount = await Book.countDocuments();
            if (bookCount === 0) {
                return res.status(404).json({ message: "No books found" });
            }
        // Fetch all books from the database
        const books = await Book.find({});

        // Store the books in Redis cache for future requests
        await client.set('books', JSON.stringify(books), 'EX', 6000); // Cache for 1 hour
        console.log("Books fetched from database ");
        return res.status(200).json({ message: "Books fetched successfully", books });
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching books", error });
    }
}

const getBookById = async (req, res) => {
    try {
        // Check if the book is in the Redis cache
        const cachedBook = await client.get(`book:${req.params.id}`);
        if (cachedBook) {
            const book = JSON.parse(cachedBook);
            console.log("Book fetched from cache");
            return res.status(200).json({ message: "Book fetched from cache", book });
        }
        
        // If not in cache, fetch from database
        const bookId = req.params.id;
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        // Store the book in Redis cache for future requests
        await client.set(`book:${bookId}`, JSON.stringify(book), 'EX', 6000); // Cache for 1 hour
        console.log("Book fetched from database");
        res.status(200).json(book);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching book", error });
    }
}

const createBook = async (req, res) => {
    try {
        const bookData = req.body;
        const newBook = await Book.create(bookData);
        if (newBook) {
            return res.status(201).json({ message: "Book created successfully", book: newBook });
        }
    } catch (error) {
        res.status(500).json({ message: "Error creating book", error });
    }
}

const updateBook = async (req, res) => {
    const bookId = req.params.id;
    const bookData = req.body;
    try {
        const updatedBook = await Book.findByIdAndUpdate(bookId, bookData, { new: true });
        if (!updatedBook) {
            return res.status(404).json({ message: "Book not found" });
        }
        res.status(200).json({ message: "Book updated successfully", book: updatedBook });
    }
    catch (error) {
        res.status(500).json({ message: "Error updating book", error });
    }
}

const deleteBook = async (req, res) => {
    const bookId = req.params.id;
    try {
        const deletedBook = await Book.findByIdAndDelete(bookId);
        if (!deletedBook) {
            return res.status(404).json({ message: "Book not found" });
        }
        res.status(200).json({ message: "Book deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Error deleting book", error });
    }
}

module.exports = {
    getAllBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook
}