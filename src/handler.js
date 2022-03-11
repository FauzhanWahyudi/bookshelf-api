const { nanoid } = require('nanoid')
const books = require('./books')

const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading
  } = request.payload

  const id = nanoid(16)
  const finished = pageCount === readPage
  const insertedAt = new Date().toISOString()
  const updatedAt = insertedAt

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt
  }

  books.push(newBook)

  const isErrorName = newBook.name === undefined
  const isErrorReadPage = newBook.readPage > newBook.pageCount
  const isSuccess = books.filter((book) => book.id === id).length > 0

  if (isErrorName) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku'   
      })
    response.code(400)
    return response
  }

  if (isErrorReadPage) {
    const response = h.response({
      status: 'fail',
      message: "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount"
    })
    response.code(400)
    return response
  }

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id
      }
    })
    response.code(201)
    return response
  }

  // generic Error
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan'
  })
  response.code(500)
  return response
}

const getAllBooksHandler = () => ({
  status: 'success',
  data: {
    books
  }
});


const getBookByIdHandler = (request, h) => {
  const {bookId} = request.params

  const book = books.filter((n) => n.id === bookId)[0]

  if (book === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan'
    })
    response.code(404)
    return response
  }

  const response = h.response({
    status: 'success',
    data: {
      book
    }
  })
  response.code(200)
  return response
}

const editBookByIdHandler = (request, h) => {
  const {bookId}  = request.params

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading
  } = request.payload

  const updatedAt = new Date().toISOString()
  const index = books.findIndex((n) => n.id === bookId)
  const isErrorNameEdit = name === undefined
  const isErrorReadPageEdit = readPage > pageCount
  const finished = pageCount === readPage

  if (isErrorNameEdit) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku'
    })
    response.code(400)
    return response
  }

  if (isErrorReadPageEdit) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
    })
    response.code(400)
    return response
  }

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,
      reading,
      updatedAt
    }
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui'
    })
    response.code(200)
    return response
  }

  // generic error
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan'
  })
  response.code(404)
  return response
}

const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params

  const index = books.findIndex((n) => n.id === bookId)

  if (index !== -1) {
    books.splice(index, 1)
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus'
    })
    response.code(200)
    return response
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan'
  })
  response.code(404)
  return response
}

const getBooksByNameHandler = (request, h) => {
  let searchBook = books;
  let {name,reading,finished} = request.query;

  if (name !== undefined) {
    name = name.toLowerCase();
    searchBook = searchBook.filter((n) => 
      n.name.toLowerCase() = name
      );
  }

  if (reading !== undefined) {
    reading = reading !== '0';
    searchBook = searchBook.filter((n) => n.reading === reading);
  }

  if (finished !== undefined) {
    finished = finished !== '0';
    searchBook = searchBook.filter((n) => n.finished === finished);
  }

  searchBook = searchBook.map((n) => ({
    id: n.id,
    name: n.name,
    publisher: n.publisher,
  }));

  const response = h.response({
    status: 'success',
    data:{
      books: searchBook
    }
  }).cod(200)
  return response
}


module.exports = { addBookHandler, getAllBooksHandler, getBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler,getBooksByNameHandler }
