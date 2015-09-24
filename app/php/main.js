$(function() {
  $('a[href*=#]:not([href=#])').click(function() {
    gotoHash(this);
  });
  var gotoHash = function(e) {
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