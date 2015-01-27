;(function($) {

// scroll location before overlay was opened
var originalScrollTop = 0;

// if the work overlay is on
var workOverlayOn = false;

// if the image gallery popup is on
var galleryPopupOn = false;

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

        // hackish. If the magnific popup isn't open, handle the escape key. Otherwise it closes the popup
        if (!galleryPopupOn) {
            if (e.keyCode == 27) {
                router.setRoute('/');
            }
        }
    });

    // work links - incercept and route to the anchor instead
    // this keeps the links crawlable
    $('.work-link').click(function(e) {
        e.preventDefault();
        var url = window.location.href;
        var separator = '';

        // both of these are valid homeView urls
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

    // Open new window, then load the content
    if ( !workOverlayOn ) {
        work_overlay_on(function() {
            $(window).scrollTop(0);
            load_work_content(workSlug);
        });
    }

    // Load content in same window with a fancy fade
    else {
        // scroll to top
        $('.spinner').show();
        $('body,html').animate({scrollTop: '0'}, function() {

            $('.work-content-container').animate({'opacity': 0.1}, function() {
                load_work_content(workSlug, function() {
                    $('.work-content-container').fadeIn();
                    $('.spinner').hide();
                });
            });

        });
    }

}

function load_work_content(workSlug, callback) {
    
    $.get('works/' + workSlug + '/' + '?' + build_timestamp, function(data) {

        // A bit hacky, yes. Get the content to display from work-container.
        var html_data = $.parseHTML(data);
        var work_container_html = $('<div/>').append(html_data).find('.work-ajax-container').html()
        $('#work-overlay-content').empty();
        $('#work-overlay-content').html(work_container_html);

        // close button. Prevents scrolling to top
        $('#work-overlay-content .close').on('click', function(e) {
            router.setRoute('/');
            e.preventDefault();
        });

        // sticky work nav 
        var orig_nav_top = -1;
        var scroll_top = 0;

        var nav_top = $('.work-nav').offset().top;  
        $(window).on('scroll', function() {
            scroll_top = $(window).scrollTop();  
            if ( scroll_top > nav_top ) {
                orig_nav_top = nav_top;
                $('.work-nav-anchor').show();
                $('.work-nav-anchor').height($('.work-nav').innerHeight());
                $('.work-nav').addClass('fixed');
            }
            if ( scroll_top < orig_nav_top ) {
                $('.work-nav-anchor').hide();
                $('.work-nav').removeClass('fixed');
            }
        });

        // videos
        $('#work-overlay-content .videoembed').fitVids();

        $('.gallery').magnificPopup({ 
            delegate: '.gallery-image',
            type: 'image',
            gallery: {
                enabled: true
            },
            callbacks: {
                open: function() { galleryPopupOn = true; },
                close: function() { galleryPopupOn = false; }
            }
        });

        if ( callback ) { callback(); }
    });
}

function homeView() {
    if ( workOverlayOn ) {
        work_overlay_off();
    }
}

/*** HELPERS ***/

function work_overlay_on(callback) {
    
    originalScrollTop = $(window).scrollTop();
    var width = $('#main-content-container').width();

    // set main content to fixed so that overlay scrolls instead
    $('#main-content').css({'position': 'fixed'});
    $('#main-content').css({'top': -originalScrollTop});

    // width minus margin, which is changed when the position is set to fixed
    $('#main-content').width(width-64);

    // get ready for the fade
    $('#work-overlay-container').css({'opacity': '0.1'});
    $('#work-overlay-container').css({'display': 'inline'});

    // scroll to top and fade in
    $('#shade').fadeIn();
    $('#work-overlay-container').animate({'opacity': '1.0'});

    // click will close, only if it is outside work-overlay
    $('#work-overlay-container').on('click', function() {
        router.setRoute('/');
    });

    $('#work-overlay').on('click', function(e) {
        e.stopPropagation();
    });

    workOverlayOn = true;
    if (callback) { callback(); }
}

function work_overlay_off(callback) {
    $('#shade').fadeOut();
    $('#work-overlay-container').fadeOut(function() {

        // set main content back to static
        $('#main-content').css({'position': 'static'});
        $('#main-content').width('auto');

        // hide overlay completely
        $('#work-overlay-container').css({'display': 'none'});

        // clear content
        $('#work-overlay-content').empty();

        // scroll to where we were on the main page
        $(window).scrollTop(originalScrollTop);
    });

    // clean up event handlers
    $('#work-overlay-container').off('click');
    $('#work-overlay').off('click');

    workOverlayOn = false;
    if ( callback ) { callback(); }
}

})(jQuery);
