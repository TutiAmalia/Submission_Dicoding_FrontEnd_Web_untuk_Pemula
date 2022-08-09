const books = [];
const RENDER_EVENT = "render-book";
const SEARCHED_EVENT = "search-book";
const EDIT_EVENT = "edit-book";
const DELETED_EVENT = "delete-book";
const SAVED_EVENT = "save-book";
const STORAGE_KEY = "bookshelf-app";


document.addEventListener('DOMContentLoaded', function () {
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
    const isCompleted = document.getElementById('check').checked;

    const generatedID = generatedId();
    const bookshelfObject = generateObject(generatedID, textBook, authors, years, isCompleted);
    books.push(bookshelfObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    //saveData();
}

function generatedId() {
    return +new Date();
}

function generateObject(id, title, author, year, isCompleted) {
    return {
        id,
        title,
        author,
        year,
        isCompleted
    }
}

document.addEventListener(RENDER_EVENT, function () {
    const uncompletedBookList = document.getElementById('uncompleted');
    uncompletedBookList.innerHTML = '';

    const completedBookList = document.getElementById('completed');
    completedBookList.innerHTML = '';

    for (const bookItem of books) {
        const bookElement = makeList(bookItem);
        if (!bookItem.isCompleted) {
            uncompletedBookList.append(bookElement);
        } else {
            completedBookList.append(bookElement);
        }
    }
});

function makeList(bookshelfObject) {
    const bookList = document.createElement('div');
    bookList.classList.add('list');

    const listStyle = document.createElement('div');
    listStyle.classList.add('list-style');

    const bookTitle = document.createElement('span');
    bookTitle.classList.add('book-title');
    bookTitle.innerText = bookshelfObject.title;

    const bookAuthors = document.createElement('p');
    bookAuthors.innerText = bookshelfObject.author;

    const bookYears = document.createElement('p');
    bookYears.innerText = bookshelfObject.year;

    const textContainer = document.createElement('div');
    textContainer.classList.add('sub-title');
    textContainer.append(bookAuthors, bookYears);

    listStyle.append(bookTitle, textContainer);

    const buttonList = document.createElement('div');
    buttonList.classList.add('action-buttons');
    

    const undoButton = document.createElement('button');
    undoButton.classList.add('hero-icon');
    undoButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>';

    const saveButton = document.createElement('button');
    saveButton.classList.add('hero-icon');
    saveButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 hero-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>';

    const trashButton = document.createElement('button');
    trashButton.classList.add('hero-icon');
    trashButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 hero-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>';

    buttonList.append(undoButton, saveButton, trashButton);

    bookList.append(listStyle);
    bookList.append(buttonList);
    bookList.setAttribute('id', `todo-${bookshelfObject.id}`);

    if (bookshelfObject.isCompleted) {

        undoButton.addEventListener('click', function () {
            undoTaskFromCompleted(bookshelfObject.id);
        });

        buttonList.append(undoButton);
        // }

        // if (bookshelfObject.isCompleted) {
        //     const undoButton = document.createElement('button');
        //     undoButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 hero-icon" fill="none"
        //         viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        //         <path stroke-linecap="round" stroke-linejoin="round"
        //             d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        //     </svg>`
        //     undoButton.getElementById('undo');

        //     undoButton.addEventListener('click', function () {
        //         undoTaskFromCompleted(bookshelfObject.id);
        //     });

        //     const saveButton = document.createElement('button');
        //     saveButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 hero-icon" fill="none"
        //     viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        //     <path stroke-linecap="round" stroke-linejoin="round"
        //         d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
        // </svg>`

        //     // saveButton.addEventListener('click', function () {
        //     //     saveTaskFromCompleted(bookshelfObject.id);
        //     // });


        //     // const trashButton = document.createElement('button');
        //     // trashButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 hero-icon" fill="none"
        //     // viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        //     // <path stroke-linecap="round" stroke-linejoin="round"
        //     //     d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>`

        //     // trashButton.addEventListener('click', function () {
        //     //     removeTaskFromCompleted(bookshelfObject.id)
        //     // })

        //     // buttonList.append(undoButton, saveButton, trashButton);
        //     buttonList.append(undoButton);
        // } else {
        //     const checkButton = document.createElement('button');
        //     checkButton.classList.add('action-buttons');

        //     checkButton.addEventListener('click', function () {
        //         addBookToCompled(bookshelfObject.id)
        //     });

        //     bookList.append(checkButton);
    }
    // // console.log(bookTitle);
    // bookList.append(buttonList);
    return bookList;
}

function addBookToCompled(bookId) {

}