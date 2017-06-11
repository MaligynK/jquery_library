'use strict';

let HTML_ID = 'mkj_book_elem_';

class Book {

    html_id(){
        return 'mkj_book_elem_' + this._id;
    }

    constructor(id, name, author, date, pages) {
        this._id = id;

        let html_elem = $(
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

        this._html_elem = html_elem;
        html_elem.attr('id', this.html_id(id));
        $('#mkj_book_container').append(html_elem);


        // при помощи html_elem производим замыкание функции
        // можно конечно заменить на $(event.target), но зачем
        html_elem.mouseenter(function(event){
            console.log('1', event)
            html_elem.find('.mkj-edit').show();
            html_elem.find('.mkj-remove').show();
        });
        html_elem.mouseleave(function(event){
            console.log('0', event)
            html_elem.find('.mkj-edit').hide();
            html_elem.find('.mkj-remove').hide();
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
    let t = new Book(1, '!!!!!', 'rtrth', 2001, 105);

};


console.log('!!!!!!!!!!!');