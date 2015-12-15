app.handler(function() {
    var $page = $(this);

    return function(param) {

        // add states from outside
        var $option = $('<option/>');
        for (var i = 0; i < window.states.length; i++) {
            $("#state").append(
                $option
                .clone()
                .attr('value', window.states[i].name)
                .html(window.states[i].name)
            );
        }

        // submit form
        $("#addEdit").submit(function(event) {

            var data = {
                _fileName: param,
                name: $(this).find("#name").val(),
                email: $(this).find("#email").val(),
                telephone: $(this).find("#telephone").val(),
                address: $(this).find("#address").val(),
                street: $(this).find("#street").val(),
                city: $(this).find("#city").val(),
                state: $(this).find("#state").val(),
                zip: $(this).find("#zip").val()
            };

            $.post( "/api/add/", JSON.stringify(data))
                .done(function(data) {
                    window.location.href = '/#list';
                })
                .fail(function(error) {
                    console.log(error);
                });

            return false;
        });

        // edit exist item
        if(param) {
            var url = '/api/' + param;

            $.get(url)
                .done(function(obj) {
                    for (var key in obj) {
                        if(key === '_fileName') continue;
                        $('#' + key).val(obj[key]);
                    }
                })
                .fail(function(error) {
                    console.log(error.responseText);
                })
                .always(function() {
                    componentHandler.upgradeDom();
                });

        } else {
            componentHandler.upgradeDom(); // MDL
        }
    };
});