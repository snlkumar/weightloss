// This is a manifest file that'll be compiled into including all the files listed below.
// Add new JavaScript/Coffee code in separate files in this directory and they'll automatically
// be included in the compiled file accessible from http://example.com/assets/application.js
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//
//= require jquery
//= require jquery_ujs
//= require jquery-ui
//= require underscore
//= require highcharts
//= require jquery.labelify
//= require jquery.jeditable
//= require jquery.format 
//= require jquery.tinyscrollbar.min.js
//= require flowplayer-3.2.6.min


jQuery.ajaxSetup({
  'beforeSend': function(xhr) {
    $('#ajax-spinner').show();
    // xhr.setRequestHeader("Accept", "text/javascript");
  },
  'complete': function(xhr, textstatus){
    $('#ajax-spinner').hide();
  }
});

function remove_meal_or_exercise_item(link){
  $(link).prev("input[type=hidden]").val("1");
  $(link).closest("tr").fadeOut();
}

function preloadImages(images){
  if (images.length > 0) {
    jQuery("<img>").attr("src", images.splice(0,1)).load(function() {
      preloadImages(images);
    });
  }
}

// Global OnReady callbacks
$(document).ready(function() {

  // Form Error fields onFocus, blank out, remove error styling
  $(".fieldError").live('focus', function(){
    // If a form field has a error we still want to show help messages
    if($(this).hasClass('fieldError')){
      if( $(this).is('input') ){ 
        $(this).val('');
      }
      $(this).removeClass('fieldError');
    }
  });
  
  // All links with class 'submit', submit their parent form
  $('a.submit').live('click', function(evt){
    evt.preventDefault();
    $(this).closest('form').submit();
  });
  
  $('input[type=text]').labelify({labelledClass: "label-highlight"});
  
});
