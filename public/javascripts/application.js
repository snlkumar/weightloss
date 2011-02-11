// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults

jQuery.ajaxSetup({
  'beforeSend': function(xhr) {
    xhr.setRequestHeader("Accept", "text/javascript")
  }
});

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
  
});
