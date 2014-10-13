(function($) {

var routes = {
    '/works/:workSlug/': workView,
    '/': homeView
}

var router = Router(routes).configure({'strict': false});

/*** INIT ***/

$(function() {

    // hack to allow the first back button to work properly
    $(window).on('hashchange', function() {
        if (location.hash == '') {
            homeView();
        }
    });

    // keyboard shortcuts
    $(document).on('keydown', function(e) {
        if (e.keyCode == 27) {
            router.setRoute('/');
        }
    });

    // work links - incercept and route to the anchor
    $('.work-link').click(function(e) {
        e.preventDefault();
        var url = window.location.href;
        var separator = '';

        // both of these are valid homeView routes
        if ( url.slice('-1') == '#' ) {
            separator = '/';
        }
        else if ( !(url.slice('-2') == '#/') ) {
            separator = separator + '#/';
        }

        url = url + separator + $(this).attr('href');

        window.location.href = url;
    });

    router.init();
});


/*** VIEWS ***/

function workView(workSlug) {
    $.get('works/' + workSlug + '/', function(data) {
        // A bit hacky, yes. Get the content to display from work-container.
        var html_data = $.parseHTML(data);
        var work_container_html = $('<div/>').append(html_data).find('.work-container').html()
        $('#work-overlay-content').html(work_container_html);

        work_overlay_on();
    });
}

function homeView() {
    work_overlay_off();
}


/*** HELPERS ***/

var originalScrollTop = 0;

function work_overlay_on() {
    
    originalScrollTop = $(window).scrollTop();
    var width = $('#main-content-container').width();

    // set main content to fixed so that overlay scrolls instead
    $('#main-content').css({'position': 'fixed'});
    $('#main-content').css({'top': -originalScrollTop});
    $('#main-content').width(width-64);

    // get ready for the fade
    $('#work-overlay-container').css({'opacity': '0.1'});
    $('#work-overlay-container').css({'display': 'inline'});

    // scroll to top and fade in
    $(window).scrollTop(0);
    $('#work-overlay-container').animate({'opacity': '1.0'});


    // click to close, only if the click is outside work-overlay
    $('#work-overlay-container').on('click', function() {
        router.setRoute('/');
    });
    
    $('#work-overlay').on('click', function(e) {
        e.stopPropagation();
    });

    var fix_work_overlay_height = function() {
        if ( $('#work-overlay-container').height() < $(window).height() ) {
            $('#work-overlay-container').height($(window).height());
        }
    }();

    $(window).on('resize', fix_work_overlay_height);
}

function work_overlay_off() {
    $('#work-overlay-container').animate({'opacity': '0.0'}, function() {

        // make sure height is auto incase it was set to a px
        $('#work-overlay-container').height('auto');

        // set main content back to static
        $('#main-content').css({'position': 'static'});
        $('#main-content').width('auto');

        // hide overlay completely
        $('#work-overlay-container').css({'display': 'none'});

        // scroll to where we were on the main page
        $(window).scrollTop(originalScrollTop);

    });

    // clean up event handlers
    $('#work-overlay-container').off('click');
    $('#work-overlay').off('click');

    $(window).off('resize');
}

})(jQuery);
