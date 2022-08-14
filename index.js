const books = [];
const RENDER_EVENT = "render-book";
const SEARCHED_EVENT = "search-book";
// const EDIT_EVENT = "edit-book";
// const DELETED_EVENT = "delete-book";
const SAVED_EVENT = "save-book";
const STORAGE_KEY = "bookshelf-app";


document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('form');

    submitForm.addEventListener('submit', function (event) {
        const hasbookId = submitForm.getAttribute('data-id');
        event.preventDefault();
        if (hasbookId) {
            updateBook(hasbookId);
            submitForm.removeAttribute('data-id');
        } else {
            addBook();
        }
    });

    const searchForm = document.getElementById("search-form");
    searchForm.addEventListener("submit", (e) => {
        document.getElementById("undo-btn");
        e.preventDefault();
        const query = e.target.querySelector("[name='query']").value
        if (query) {
            const filteredBooks = searchBook(query);
            renderSearchResult(filteredBooks, query);
        }

    });

    if (isStorageExist()) {
        loadDataFromStorage();
    }
});

document.addEventListener(RENDER_EVENT, function () {
    const uncompletedBookList = document.getElementById('uncompleted');
    uncompletedBookList.innerHTML = '';

    const completedBookList = document.getElementById('completed');
    completedBookList.innerHTML = '';
    const completedBookLength = books.filter(book => book.isCompleted === true).length;
    const uncompletedBookLength = books.filter(book => book.isCompleted === false).length;
    if (completedBookLength == 0) { completedBookList.innerHTML = '<p class="py-3 px-4 text-sm">Belum ada buku di rak ini</p>';}
    if (uncompletedBookLength == 0) { uncompletedBookList.innerHTML = '<p class="py-3 px-4 text-sm">Belum ada buku di rak ini</p>';}

    for (const bookItem of books) {
        const bookElement = makeList(bookItem);

        if (!bookItem.isCompleted) {
            uncompletedBookList.append(bookElement);
        } else {
            completedBookList.append(bookElement);
        }
    }
});

// Local Storage
document.addEventListener(SAVED_EVENT, function () {
    localStorage.getItem(STORAGE_KEY);
});

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data !== null) {
        for (const todo of data) {
            books.push(todo);
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}

// Merender Hasil Pencarian
function renderSearchResult(filteredBooks, query) {
    const uncompletedBookList = document.getElementById('uncompleted');
    uncompletedBookList.innerHTML = '';

    const completedBookList = document.getElementById('completed');
    completedBookList.innerHTML = '';

    const reset = document.getElementById('undo-btn');
    reset.classList.add('undo');
    reset.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L9.414 11H13a1 1 0 100-2H9.414l1.293-1.293z" clip-rule="evenodd" /></svg>'
    
    const notif = document.getElementById('notification');
    notif.classList.add('notification');
    notif.innerHTML = `Menampilkan buku dengan kata kunci <strong>${query}</strong>`;
    
    const completedBookLength = filteredBooks.filter(book => book.isCompleted === true).length;
    const uncompletedBookLength = filteredBooks.filter(book => book.isCompleted === false).length;
    
    reset.addEventListener('click', function(){   
        const query = document.querySelector("[name='query']");
        query.value = '';
        reset.innerHTML = '';
        notif.innerHTML = '';
        document.dispatchEvent(new Event(RENDER_EVENT));
    })

    if (completedBookLength == 0) { completedBookList.innerHTML = '<p class="py-3 px-4 text-sm">Belum ada buku di rak ini</p>';}
    if (uncompletedBookLength == 0) { uncompletedBookList.innerHTML = '<p class="py-3 px-4 text-sm">Belum ada buku di rak ini</p>';}

    for (const bookItem of filteredBooks) {
        const bookElement = makeList(bookItem);

        if (!bookItem.isCompleted) {
            uncompletedBookList.append(bookElement);
        } else {
            completedBookList.append(bookElement);
        }
    }

};

function searchBook(query) {
    const filteredBooks = books.filter((book) => {
        return (
            book.title.toLowerCase().includes(query.toLowerCase()) ||
            book.author.toLowerCase().includes(query.toLowerCase())
        );
    });
    return filteredBooks;
}

function isStorageExist() {
    if (typeof (Storage) === undefined) {
        alert('Browser kamu tidak mendukung local storage');
        return false;
    }
    return true;
}

function addBook() {
    const textBook = document.getElementById('title').value;
    const authors = document.getElementById('author').value;
    const years = document.getElementById('year').value;
    const isCompleted = document.getElementById('check').checked;

    const generatedID = generatedId();
    const bookshelfObject = generateObject(generatedID, textBook, authors, years, isCompleted);
    books.push(bookshelfObject);
    resetFromInput();

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
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

function makeList(bookshelfObject) {
    const bookList = document.createElement('div');
    bookList.classList.add('list');

    const listStyle = document.createElement('div');
    listStyle.classList.add('list-style');

    const bookTitle = document.createElement('span');
    bookTitle.classList.add('book-title');
    bookTitle.innerText = bookshelfObject.title;

    const textContainer = document.createElement('div');
    textContainer.classList.add('sub-title');

    const bookAuthors = document.createElement('p');
    bookAuthors.innerText = bookshelfObject.author;

    const bookYears = document.createElement('p');
    bookYears.innerText = bookshelfObject.year;

    textContainer.append(bookAuthors, bookYears);
    listStyle.append(bookTitle, textContainer);

    const buttonList = document.createElement('div');
    buttonList.classList.add('action-buttons');

    const but = clickButton()

    document.getElementById('changes').innerText = 'belum selesai dibaca';

    bookList.append(listStyle);
    bookList.append(buttonList);
    bookList.setAttribute('id', `todo-${bookshelfObject.id}`);

    but.undoButton.addEventListener('click', function () {
        editBookList(bookshelfObject.id);
    });

    buttonList.append(but.undoButton);
    if (bookshelfObject.isCompleted) {
        but.saveButton.addEventListener('click', function () {
            moveBookFromList(bookshelfObject.id);
            console.log(bookshelfObject.isCompleted);
        });
        buttonList.append(but.saveButton);
    } else {
        but.centangButton.addEventListener('click', function () {
            moveBookFromList(bookshelfObject.id);
            console.log(bookshelfObject.isCompleted);
        });
        buttonList.append(but.centangButton);
    }

    but.trashButton.addEventListener('click', function () {
        deleteBookFromList(bookshelfObject.id);
    });

    buttonList.append(but.trashButton);

    return bookList;
}

function updateBook(bookId) {
    const textBook = document.getElementById('title').value;
    const authors = document.getElementById('author').value;
    const years = document.getElementById('year').value;
    const isCompleted = document.getElementById('check').checked;

    const book = books.find((book) => book.id == bookId);
    book.title = textBook;
    book.author = authors;
    book.year = years;
    book.isCompleted = isCompleted;

    resetFromInput();

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function editBookList(bookId) {

    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    document.getElementById('title').value = bookTarget.title;
    document.getElementById('author').value = bookTarget.author;
    document.getElementById('year').value = bookTarget.year;
    document.getElementById('check').checked = bookTarget.isCompleted;

    const booksID = document.getElementById('form');
    booksID.setAttribute('data-id', bookTarget.id);
    document.dispatchEvent(new Event(RENDER_EVENT));
}

function moveBookFromList(bookId) {
    const bookTarget = findBook(bookId)

    if (bookTarget == null) return;

    if (bookTarget.isCompleted === true) {
        bookTarget.isCompleted = false;
    } else {
        bookTarget.isCompleted = true;
    }
    document.dispatchEvent(new Event(RENDER_EVENT))

    saveData();

}

function deleteBookFromList(bookId) {
    const bookTarget = findBookIndex(bookId);

    if (bookTarget === -1) return;

    books.splice(bookTarget, 1);
    resetFromInput();
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function findBook(bookId) {
    for (const bookItem of books) {
        if (bookItem.id === bookId) {
            return bookItem;
        }
    }

    return null;
}

function findBookIndex(bookId) {
    for (const index in books) {
        if (books[index].id === bookId) {

            return index;
        }
    }

    return -1;
}

function resetFromInput() {
    document.getElementById('title').value = '';
    document.getElementById('author').value = '';
    document.getElementById('year').value = '';
    document.getElementById('check').checked = false;
}


function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

function clickButton() {
    const undoButton = document.createElement('button');
    undoButton.classList.add('hero-icon');
    undoButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>';

    const centangButton = document.createElement('button');
    centangButton.classList.add('hero-icon');
    centangButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>';

    const saveButton = document.createElement('button');
    saveButton.classList.add('hero-icon');
    saveButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 hero-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>';

    const trashButton = document.createElement('button');
    trashButton.classList.add('hero-icon');
    trashButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 hero-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>';

    return {
        undoButton,
        centangButton,
        saveButton,
        trashButton
    }
}

document.getElementById('check').addEventListener('change', function () {
    if (this.checked) {
        document.getElementById('changes').innerText = 'selesai dibaca';
    } else {
        document.getElementById('changes').innerText = 'belum selesai dibaca';
    }

});