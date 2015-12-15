(function($,window){

    //                  API
    //             Get List: /api/
    //      Get Single Item: /api/{id}
    // Add New or Edit Item: /api/add/{id}
    //          Delete Item: /api/delete/{id}

    var pageHandlers = {};
    var currentPage;

    // show the 'page' with optional parameter
    function show(pageName, param) {
    // invoke page handler
    var ph = pageHandlers[pageName];
    if( ph ) { 
        var $page = $('section#' + pageName);
        ph.call( $page.length ? $page[0] : null, param); // call 'page' handler
    }

    // set header
    $('.mdl-layout-title').html(pageName);

    // activate the page in menu
    $('nav a.active').removeClass('active');
    $('nav a[href=#'+pageName+']').addClass('active');

    // activate the page
    $(document.body).attr('page', pageName)
        .find('section').removeClass('active')
        .filter('section#' + pageName).addClass('active');

    }  

    function app(pageName,param) {

        var $page = $(document.body).find('section#' + pageName);
        var src = $page.attr('src');

        if ( src && $page.length) {

            $.get(src)
                .done(function(html) {
                    currentPage = pageName;
                    $page.html(html);
                    show(pageName,param);
                })
                .fail(function(error) {
                    var errorMessage = 'Error ' + error.status + ' ' + error.statusText + ' [ ' + error.responseText.trim() + ' ]';
                    $page.html($(document.body).find('section#error').html());
                    $(document.body).find('section#' + pageName + ' div').html(errorMessage);
                    show(pageName, param);
                });

        } else {
            $page = $(document.body).find('section#error');
            $(document.body).find('section#error div').html('The page [ ' + pageName + ' ] is absent.');
            show('error', param);
        }
    }

    // register page handler  
    app.handler = function(handler) {
        var $page = $(document.body).find('section#' + currentPage);  
        pageHandlers[currentPage] = handler.call($page[0]);
    };

    function onhashchange() {
        var hash = location.hash || '#list'; // default hash

        var re = /#([-0-9A-Za-z]+)(\:(.+))?/;
        var match = re.exec(hash);
        hash = match[1];
        var param = match[3];
        app(hash,param); // navigate to the page
    }

    window.addEventListener("hashchange", onhashchange); // attach hashchange handler

    $(function() { onhashchange(); }); // initial setup

    window.app = app;

})(jQuery,this);
