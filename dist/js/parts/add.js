app.handler(function(){$(this);return function(n){for(var t=$("<option/>"),e=0;e<window.states.length;e++)$("#state").append(t.clone().attr("value",window.states[e].name).html(window.states[e].name));if($("#addEdit").submit(function(t){var e={_fileName:n,name:$(this).find("#name").val(),email:$(this).find("#email").val(),telephone:$(this).find("#telephone").val(),address:$(this).find("#address").val(),street:$(this).find("#street").val(),city:$(this).find("#city").val(),state:$(this).find("#state").val(),zip:$(this).find("#zip").val()};return $.post("/api/add/",JSON.stringify(e)).done(function(n){window.location.href="/#list"}).fail(function(n){console.log(n)}),!1}),n){var i="/api/"+n;$.get(i).done(function(n){for(var t in n)"_fileName"!==t&&$("#"+t).val(n[t])}).fail(function(n){console.log(n.responseText)}).always(function(){componentHandler.upgradeDom()})}else componentHandler.upgradeDom()}});