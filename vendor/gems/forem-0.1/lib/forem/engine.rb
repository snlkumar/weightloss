module ::Forem
  class Engine < Rails::Engine
    isolate_namespace Forem

    class << self
      attr_accessor :root
      def root
        @root ||= Pathname.new(File.expand_path('../../', __FILE__))
      end
    end
    
    initializer 'engine.helper' do |app|
      ActionView::Base.send :include, Forem::ApplicationHelper
    end
  end
end

require 'simple_form'
