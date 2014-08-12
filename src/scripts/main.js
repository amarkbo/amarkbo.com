var routes = {
    '/works/:workSlug': workView,
    '/': mainView
}

$(function() {
    var router = Router(routes);
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
    $.get('works/' + workSlug, function(data) {
        $('#work-content').html(data);
        work_overlay_on();
    });
}

function mainView() {
    console.log('main');
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

    // make overlay visible
    $('#overlay-content').css({'display': 'inline'});
    $('#overlay-content').css({'position': 'absolute'});

    // scroll to top
    $(window).scrollTop(0);
}

function work_overlay_off() {
    // reset main content
    $('#main-content').css({'position': 'static'});
    $('#main-content').width('auto');

    // hide overlay
    $('#overlay-content').css({'display': 'none'});

    // scroll to where we were!
    $(window).scrollTop(originalScrollTop);
}
