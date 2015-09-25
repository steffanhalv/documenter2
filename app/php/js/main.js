$(document).ready(function() {

  navPos();
  $('.toggle').click(function() {
    $('.nav-mobile').toggleClass('active');
  });

});

var navPos = function() {

  $(window).scroll(function() {
    var windscroll = $(window).scrollTop();
    if (windscroll >= 300 && $('.container').height()>$('.nav-large').height()) {
      $('.nav-large').addClass('fixed');
      $('.container').addClass('right');
    } else {

      $('.nav-large').removeClass('fixed');
      $('.container').removeClass('right');

    }

  }).scroll();

};

$(function() {
  $('a[href*=#]:not([href=#])').click(function() {
    gotoHash(this);
  });
  var gotoHash = function(e) {
    $('.nav-mobile').removeClass('active');
    if (location.pathname.replace(/^\//,'') == e.pathname.replace(/^\//,'') && location.hostname == e.hostname) {
      var target = $(e.hash);
      target = target.length ? target : $('[name=' + e.hash.slice(1) +']');
      if (target.length) {
        $('html,body').animate({
          scrollTop: target.offset().top
        }, 1000);
        return false;
      }
    }
  };
});