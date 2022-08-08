const books = [];
const RENDER_EVENT = "render-book";
const SEARCHED_EVENT = "search-book";
const EDIT_EVENT = "edit-book";
const DELETED_EVENT = "delete-book";
const SAVED_EVENT = "save-book";
const STORAGE_KEY = "bookshelf-app";


document.addEventListener('DOMContentLoaded', function (){
    const submitForm = document.getElementById('form');
    submitForm.addEventListener('submit', function (event) {
        event.preventDefault();
        addBook();
    });
})

function addBook() {
    const textBook = document.getElementById('title').value;
    const authors = document.getElementById('author').value;
    const years = document.getElementById('year').value;
    const checkBox = document.getElementById('check').checked

    const generatedID = generatedId();
    const bookshelfObject = generateObject(generatedID, textBook, authors, years,)
}