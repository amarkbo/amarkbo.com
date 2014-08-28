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

    $('#work-overlay-container').css({'display': 'inline'});

    $('#main-content').addClass('blur');
    $('#shade').show();

    // scroll to top
    $(window).scrollTop(0);
}

function work_overlay_off() {
    // reset main content
    $('#main-content').css({'position': 'static'});
    $('#main-content').width('auto');

    // hide overlay
    $('#work-overlay-container').css({'display': 'none'});

    $('#main-content').removeClass('blur');
    $('#shade').hide();

    // scroll to where we were!
    $(window).scrollTop(originalScrollTop);
}
