app.handler(function() {
    var $page = $(this);

    // edit item
    $('#contacts').on('click', 'button.edit', function(event) {
        console.log('edit clicked');
        var fileName = event.currentTarget.dataset.file;
        location.href = '/#add:' + fileName;
    });

    // delete item
    $('#contacts').on('click', 'button.delete', function(event) {
        var fileName = event.currentTarget.dataset.file;
        var parentTr = $(this).parent().parent();

        function removeParentTr() {
            parentTr.fadeOut('slow').remove();
        }

        $.post('/api/delete/' + fileName)
            .done(function(data) {
                removeParentTr();
            })
            .fail(function(error) {
                console.log(error.responseText);
            });
    });

    // add item to table
    function addToTable(obj, fileName) {
        
        var $tr = $('<tr/>');
        var $td = $('<td/>');
        $td.addClass('mdl-data-table__cell--non-numeric');

        delete obj._fileName;

        for(var key in obj) {
            $td
            .clone()
            .addClass(key)
            .html(obj[key])
            .appendTo($tr);
        }

        $button = $('<button/>');
        $button.addClass("mdl-button mdl-js-button mdl-button--icon");
        $buttonEdit = $button
            .clone()
            .addClass('mdl-button--colored edit')
            .attr('data-file', fileName)
            .html('<i class="material-icons">edit</i></button>');
        $buttonDelete = $button
            .clone()
            .addClass('mdl-button--accent delete')
            .attr('data-file', fileName)
            .html('<i class="material-icons">delete</i></button>');

        $td
        .clone()
        .addClass('td-button')
        .html($buttonEdit)
        .appendTo($tr);

        $td
        .clone()
        .addClass('td-button')
        .html($buttonDelete)
        .appendTo($tr);
        
        $tr.appendTo('#contacts');
    }
    
    // loop items
    var length;
    function getOneByOne(list) {
        if(!list.length) return false;
        
        var fileName = list[length - 1];
        var url = '/api/' + fileName;

        $.get(url)
            .done(function(obj) {
                addToTable(obj, fileName);
                if(--length) getOneByOne(list);
            })
            .fail(function(error) {
                console.log(error.responseText);
                if(--length) getOneByOne(list);
            });
    }

    // get item's list
    $.get('/api/')
        .done(function(list) {
            length = list.length;
            getOneByOne(list);
        })
        .fail(function(error) {
            console.log(error);
        });
});