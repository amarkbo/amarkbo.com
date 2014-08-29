var routes = {
    '/works/:workSlug/': workView,
    '/': mainView
}

$(function() {
    var router = Router(routes).configure({'strict': false});
    router.init();

    // hack to allow the first back button
    $(window).on('hashchange', function() {
        if (location.hash == '') {
            mainView();
        }
    });

    $('#shade').click(function() {
        router.setRoute('/');
    });
});

/*** VIEWS ***/

function workView(workSlug) {
    $.get('works/' + workSlug + '/', function(data) {
        $('#work-overlay').html(data);
        work_overlay_on();
    });
}

function mainView() {
    work_overlay_off();
}

/*** HELPERS ***/

var originalScrollTop = 0;

function work_overlay_on() {
    originalScrollTop = $(window).scrollTop();
    var width = $('#main-content-container').width();

    // set main content to fixed so that overlay scrolls
    $('#main-content').css({'position': 'fixed'});
    $('#main-content').css({'top': -originalScrollTop});
    $('#main-content').width(width-64);

    // show the shade
    $('#shade').show();

    $('#work-overlay-container').css({'opacity': '0.1'});
    $('#work-overlay-container').css({'display': 'inline'});

    // scroll to top
    $(window).scrollTop(0);

    $('#work-overlay-container').animate({'opacity': '1.0'});
}

function work_overlay_off() {
    $('#work-overlay-container').animate({'opacity': '0.0'}, function () {

        // reset main content
        $('#main-content').css({'position': 'static'});
        $('#main-content').width('auto');

        // hide overlay and shade
        $('#work-overlay-container').css({'display': 'none'});
        $('#shade').hide();

        // scroll to where we were!
        $(window).scrollTop(originalScrollTop);
    });
}
