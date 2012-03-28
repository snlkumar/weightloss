# Methods added to this helper will be available to all templates in the application.
module ApplicationHelper
  def pagination_params(request)
    request.params.reject{|key, val| ['authenticity_token', 'commit'].include?(key.to_s) }
  end
  
  def in_admin?
    request.path.match(/admin/)
  end
  
  def page_entries_info(collection, options = {})
    collection_name = options[:collection_name] || (collection.empty?? 'entry' : collection.first.class.name.underscore.sub('_', ' '))

    if collection.num_pages < 2
      case collection.size
      when 0; info = "No #{collection_name.pluralize} found"
      when 1; info = "Displaying <strong>1</strong> #{collection_name}"
      else;   info = "Displaying <strong>all #{collection.size}</strong> #{collection_name.pluralize}"
      end
    else
      info = %{Displaying #{collection_name.pluralize} <strong>%d&ndash;%d</strong> of <strong>%d</strong> in total}% [
        collection.offset_value + 1,
        collection.offset_value + collection.length,
        collection.total_count
      ]
    end
    info.html_safe
  end
  
  def clippy(text, bgcolor='#FFFFFF')
    html = <<-EOF
      <object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000"
              width="110"
              height="14"
              id="clippy" >
      <param name="movie" value="/flash/clippy.swf"/>
      <param name="allowScriptAccess" value="always" />
      <param name="quality" value="high" />
      <param name="scale" value="noscale" />
      <param NAME="FlashVars" value="text=#{text}">
      <param name="bgcolor" value="#{bgcolor}">
      <embed src="/flash/clippy.swf"
             width="110"
             height="14"
             name="clippy"
             quality="high"
             allowScriptAccess="always"
             type="application/x-shockwave-flash"
             pluginspage="http://www.macromedia.com/go/getflashplayer"
             FlashVars="text=#{text}"
             bgcolor="#{bgcolor}"
      />
      </object>
    EOF
    html.html_safe
  end
  
  def user_avatar_image(user, size, styles = '')
    
    if user.avatar.file?
      return image_tag(user.avatar.url(size), :styles => styles)
    else
      if user.male?
        img = asset_path('missingprofileman.png')
      else
        img = asset_path('missingprofilewoman.png')
      end
    end
    
    dimensions = User.attachment_definitions[:avatar][:styles][size]
    dimensions = dimensions[0..-2].split('x')
    height     = dimensions.last
    width      = dimensions.first
    
    image_tag(img, :style => "#{styles} ;height: #{height}px; width: #{width}px;")
  end
end
