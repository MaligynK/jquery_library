'use strict';

let HTML_ID = 'mkj_book_elem_';
let current_index = 1;

class Book {

    html_id(){
        return 'mkj_book_elem_' + this._id;
    }

    edit(){

        console.log('!!!!!!!!!!!!')
    }

    remove(){
        let html_block = this._html_elem.find('.mkj-block');
        html_block.find('.mkj-edit').off('click');
        html_block.find('.mkj-remove').off('click');
        html_block.off('click');
        html_block.off('mouseleave');
        html_block.off('mouseenter');

        this._html_elem.remove();

        console.log('!!!!!!!RM')
    }

    choice(){
        console.log('!!!!!!CH')

    }

    constructor(id, name, author, date, pages) {
        this._id = id;

        this._html_elem = $(
            '<div class="col-xs-12 col-sm-6 col-md-4 col-lg-4 mkj-book-elem">' +
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
        html_block.on('click', this.choice);
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
    current_index++;
    let t = new Book(current_index, '!!!!!', 'rtrth', 2001, 105);

};

$(document).ready(function () {
    console.log('!!!!!!!!!')
    let t = new Book(current_index, '!!!!!', 'rtrth', 2001, 105);
});