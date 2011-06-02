// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults

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
