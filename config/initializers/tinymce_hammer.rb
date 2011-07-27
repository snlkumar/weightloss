
Tinymce::Hammer.plugins = %w(tabfocus media)

Tinymce::Hammer.init = [
  [:paste_convert_headers_to_strong, true],
  [:paste_convert_middot_lists, true],
  [:paste_remove_spans, true],
  [:paste_remove_styles, true],
  [:paste_strip_class_attributes, true],
  [:theme, 'advanced'],
  [:cleanup, true],
  [:theme_advanced_toolbar_align, 'left'],
  [:theme_advanced_toolbar_location, 'top'],
  [:theme_advanced_buttons1, 'undo,redo,|,bold,italic,bullist,numlist,removeformat,|,link,unlink,image,media,video,|,code'],
  [:theme_advanced_buttons2, ''],
  [:theme_advanced_buttons3, ''],
  [:valid_elements, "a[name|href|title],blockquote[cite],br,caption,cite,code,dl,dt,dd,em,i,img[src|alt|title|width|height|align|style],li,ol,p,pre,q[cite],small,strike,strong/b,sub,sup,u,ul,param[name|value|_value],embed[type|width|height|src|*],object[classid|width|height|codebase|*],style"]
]
