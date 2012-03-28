require Forem::Engine.config.root + 'app/models/forem' + 'post'

class Forem::Post
  profanity_filter! :text
end