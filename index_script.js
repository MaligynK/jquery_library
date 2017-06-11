'use strict';

let HTML_ID = 'mkj_book_elem_';
let current_index = 1;
let current_book;
let books = [];
let books_data = [];


class Book {

    html_id(){
        return 'mkj_book_elem_' + this._id;
    }

    get id(){
        return this._id;
    }

    get json_data(){
        return {
            id: this._id,
            name: this._name,
            author: this._author,
            pages: this._pages,
            date: this._date
        }
    }

    edit(){
        current_book = this;
        $('#mkj_book_name').val(this._name);
        $('#mkj_book_author').val(this._author);
        $('#mkj_book_pages').val(this._pages);
        $('#mkj_book_date').val(this._date);
    }

    remove(){
        let html_block = this._html_elem.find('.mkj-block');
        html_block.find('.mkj-edit').off('click');
        html_block.find('.mkj-remove').off('click');
        html_block.off('mouseleave');
        html_block.off('mouseenter');
        this._html_elem.remove();
        for(let i=0; i<books_data.length; i++){
            if(this._id == books_data[i].id){
                books_data.splice(i, 1);
                save_books_data();
                break;
            }
        }
        for(let i=0; i<books.length; i++){
            if(this._id == books[i].id){
                books.splice(i, 1);
                break;
            }
        }
        if(this == current_book){
            console.log('!!!!!!cur_del')
            current_book = undefined;
        }
    }

    constructor(id, name, author, date, pages) {
        this._id = id;

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
        // можно конечно заменить на $(event.target), но зачем
        html_block.mouseenter(function(event){
            html_block.find('.mkj-edit').show();
            html_block.find('.mkj-remove').show();
        });
        html_block.mouseleave(function(event){
            html_block.find('.mkj-edit').hide();
            html_block.find('.mkj-remove').hide();
        });

        this.set_data(name, author, date, pages);
    }

    set_data(name, author, date, pages){
        this._name = name;
        this._author = author;
        this._date = date;
        this._pages = pages;
        this._html_elem.find('.mkj-book-title').text('«' + name + '»');
        this._html_elem.find('.mkj-book-author').text(author);
        this._html_elem.find('.mkj-book-date').text(date);
    }

}


let save_book = function(){
    let name = $('#mkj_book_name').val();
    let author = $('#mkj_book_author').val();
    let pages = $('#mkj_book_pages').val();
    let date = $('#mkj_book_date').val();
    //TODO: добавить валидацию

    if(current_book){
        current_book.set_data(name, author, date, pages);
        for(let i=0; i<books_data.length; i++){
            if(books_data[i].id == current_book.id){
                books_data[i] = current_book.json_data;
                save_books_data();
                break;
            }
        }
        return;
    }
    current_index++;
    let book = new Book(current_index, name, author, date, pages);
    books.push(book);
    books_data.push(book.json_data);
    save_books_data();
};

let add_book = function() {
    current_book = undefined;
    save_book();
};

let save_books_data = function () {
    // сохранение информации о книгах в локальном хранилище
    localStorage.saved_books = JSON.stringify(books_data);
};

$(document).ready(function () {
    if(localStorage.saved_books){
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