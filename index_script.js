'use strict';

// для генерации идентификаторов
let current_index = 1;
// книга выбранная для редактирования
let current_book;
// список объектов Book
let books = [];
// список данных для сохранения в localStorage
let books_data = [];

// сортировка по...
let book_sorting = '';

// Обеъкт книги с сылкой на DOM-элемент
class Book {

    html_id(){
        // id DOM-элемента
        return 'mkj_book_elem_' + this._id;
    }
    get id(){
        // id объекта
        return this._id;
    }
    get name(){
        return this._name;
    }
    get date(){
        return this._date;
    }
    get json_data(){
        // информация, которую сохраняем в localStorage
        return {
            id: this._id,
            name: this._name,
            author: this._author,
            pages: this._pages,
            date: this._date
        }
    }
    check_name(name){
        // если name находится в this._name, показываем, иначе скрываем
        if(this._name.toLowerCase().indexOf(name.toLowerCase()) > -1){
            this._html_elem.show();
        }else{
            this._html_elem.hide();
        }
    }
    edit(){
        // редактирование книги
        // делаем ее текущей
        current_book = this;
        // вставляем данные в форму редактирования
        $('#mkj_book_name').val(this._name);
        $('#mkj_book_author').val(this._author);
        $('#mkj_book_pages').val(this._pages);
        $('#mkj_book_date').val(this._date);
    }
    remove(){
        // удаление книги
        let html_block = this._html_elem.find('.mkj-block');
        // отписываемся от всего (не уверен в необходимости)
        html_block.find('.mkj-edit').off('click');
        html_block.find('.mkj-remove').off('click');
        html_block.off('mouseleave');
        html_block.off('mouseenter');
        // удаление DOM-элемента
        this._html_elem.remove();
        // удаление из сохраняемой информации
        for(let i=0; i<books_data.length; i++){
            if(this._id == books_data[i].id){
                books_data.splice(i, 1);
                save_books_data();
                break;
            }
        }
        // удаление из списка книг
        for(let i=0; i<books.length; i++){
            if(this._id == books[i].id){
                books.splice(i, 1);
                break;
            }
        }
        if(this == current_book){
            // книга была на редактировании, удаляем
            current_book = undefined;
            //TODO: нужно ли очистить форму при этом?
        }
    }

    constructor(id, name, author, date, pages) {
        this._id = id;
        // создание DOM-элемента
        this._html_elem = $(
            '<div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 mkj-book-elem">' +
                '<div class="mkj-block">' +
                    '<p class="mkj-book-title"></p>' +
                    '<p class="mkj-book-author"></p>' +
                    '<p class="mkj-book-date"></p>' +
                    '<div class="mkj-edit">' +
                        '<div class="glyphicon glyphicon-pencil"></div>' +
                    '</div>' +
                    '<div class="mkj-remove">' +
                        '<div class="glyphicon glyphicon-remove"></div>' +
                    '</div>' +
                '</div>' +
            '</div>'
        );
        this._html_elem.attr('id', this.html_id(id));
        $('#mkj_book_container').append(this._html_elem);

        let html_block = this._html_elem.find('.mkj-block');
        html_block.find('.mkj-edit').on('click', ()=>{
            this.edit();
            return false;
        });
        html_block.find('.mkj-remove').on('click', ()=>{
            this.remove();
            return false;
        });
        // при помощи html_block производим замыкание функции
        // можно, конечно, заменить на $(event.target), но не вижу смысла
        html_block.mouseenter(function(event){
            html_block.find('.mkj-edit').show();
            html_block.find('.mkj-remove').show();
        });
        html_block.mouseleave(function(event){
            html_block.find('.mkj-edit').hide();
            html_block.find('.mkj-remove').hide();
        });

        // присваиваем значения
        this.set_data(name, author, date, pages);
    }

    set_data(name, author, date, pages){
        // присваиваем значения
        this._name = name;
        this._author = author;
        this._date = date;
        this._pages = pages;
        // подставляем в DOM-элемент
        this._html_elem.find('.mkj-book-title').text('«' + name + '»');
        this._html_elem.find('.mkj-book-author').text(author);
        this._html_elem.find('.mkj-book-date').text(date);
    }

}

let check_book_errors = function (name, author, date, pages) {
    // проверяем данные в редактируемой книге на ошибки
    // возвращает true, если ошибки есть
    let current_date = new Date();
    let error = false;
    let error_name = $('.mkj-view-name .text-danger');
    let error_author = $('.mkj-view-author .text-danger');
    let error_pages = $('.mkj-view-pages .text-danger');
    let error_date = $('.mkj-view-date .text-danger');
    if(name.length < 3){
        // имя должно быть хотя бы 3 символа
        error = true;
        error_name.show();
    }else{
        error_name.hide();
    }
    if(author.length < 4){
        // имя автора хотя бы 4 символа
        error = true;
        error_author.show();
    }else{
        error_author.hide();
    }
    if(!pages || pages < 0 || pages != Math.trunc(pages)){
        // Количество страниц не мошен быть отрицательным или дробным
        error = true;
        error_pages.show();
    }else{
        error_pages.hide();
    }
    if(!date || date < 0 || date != Math.trunc(date) || date > current_date.getFullYear()){
        // год издания не верен
        error = true;
        error_date.show();
    }else{
        error_date.hide();
    }
    return error;
};

let save_book = function(){
    // сохраняем текущую редактируюмую книгу (создаем новую или редактируем старую)

    let name = $('#mkj_book_name').val();
    let author = $('#mkj_book_author').val();
    let pages = $('#mkj_book_pages').val();
    let date = $('#mkj_book_date').val();

    if(check_book_errors(name, author, date, pages)){
        // ошибка, выходим без сохранения
        return;
    }

    if(current_book){
        // книга есть, редактируем
        current_book.set_data(name, author, date, pages);
        for(let i=0; i<books_data.length; i++){
            if(books_data[i].id == current_book.id){
                books_data[i] = current_book.json_data;
                save_books_data();
                sort_again();
                break;
            }
        }
        return;
    }
    // книги нет, создаем новую
    current_index++;
    let book = new Book(current_index, name, author, date, pages);
    books.push(book);
    books_data.push(book.json_data);
    save_books_data();
    sort_again();
};

let add_book = function() {
    // создание новой книги, если есть выбранныая книга
    current_book = undefined;
    save_book();
};

let save_books_data = function () {
    // сохранение информации о книгах в локальном хранилище
    localStorage.saved_books = JSON.stringify(books_data);
};

let search_name = function(){
    // поиск по имени
    let str_search = $('#mkj_search_input').val() || '';
    for(let i in books){
        books[i].check_name(str_search);
    }
};

let sort_books = function(sort_attr){
    // сортировка
    if(sort_attr == book_sorting){
        return;
    }
    book_sorting = sort_attr;
    sort_attr = '.mkj-book-' + sort_attr;
    let book_container = $('#mkj_book_container');
    book_container.find('.mkj-book-elem').sort(function (a, b) {
        // return b[sort_attr] < a[sort_attr] ? 1 : -1;
        return $(b).find(sort_attr).text().toLowerCase() < $(a).find(sort_attr).text().toLowerCase();
    }).appendTo(book_container);
};

let sort_again = function(){
    // список изменен, необходимо вновь отсортировать
    if(!book_sorting) {
        return;
    }
    let temp_sort = book_sorting;
    book_sorting = '';
    sort_books(temp_sort);
};

$(document).ready(function () {
    if(localStorage.saved_books){
        // достаем книги из хранилища при запуске
        let book;
        books_data = JSON.parse(localStorage.saved_books);
        for(let i=0; i<books_data.length; i++){
            if(current_index < books_data[i].id){
                current_index = books_data[i].id;
            }
            book = new Book(books_data[i].id, books_data[i].name, books_data[i].author, books_data[i].date, books_data[i].pages);
            books.push(book);
        }
    }
});