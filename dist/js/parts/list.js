app.handler(function(){function t(t,n){var e=$("<tr/>"),o=$("<td/>");o.addClass("mdl-data-table__cell--non-numeric"),delete t._fileName;for(var a in t)o.clone().addClass(a).html(t[a]).appendTo(e);$button=$("<button/>"),$button.addClass("mdl-button mdl-js-button mdl-button--icon"),$buttonEdit=$button.clone().addClass("mdl-button--colored edit").attr("data-file",n).html('<i class="material-icons">edit</i></button>'),$buttonDelete=$button.clone().addClass("mdl-button--accent delete").attr("data-file",n).html('<i class="material-icons">delete</i></button>'),o.clone().addClass("td-button").html($buttonEdit).appendTo(e),o.clone().addClass("td-button").html($buttonDelete).appendTo(e),e.appendTo("#contacts")}function n(o){if(!o.length)return!1;var a=o[e-1],l="/api/"+a;$.get(l).done(function(l){t(l,a),--e&&n(o)}).fail(function(t){console.log(t.responseText),--e&&n(o)})}$(this);$("#contacts").on("click","button.edit",function(t){console.log("edit clicked");var n=t.currentTarget.dataset.file;location.href="/#add:"+n}),$("#contacts").on("click","button.delete",function(t){function n(){o.fadeOut("slow").remove()}var e=t.currentTarget.dataset.file,o=$(this).parent().parent();$.post("/api/delete/"+e).done(function(t){n()}).fail(function(t){console.log(t.responseText)})});var e;$.get("/api/").done(function(t){e=t.length,n(t)}).fail(function(t){console.log(t)})});