require "bundler/capistrano"
# require 'airbrake/capistrano'

server = "myweightworld.com" 

set :application, "myweightworld"
set :repository,  "git@myweightworld.unfuddle.com:myweightworld/myww.git"
#set :repository, "git@github.com:supairish/MyWeightWorld.git"
set :port, 6969

set :use_sudo,  false

set :scm, "git"
set :user,      'deploy'
set :password,  'rails4myweightworld'

set :keep_releases, 4
set :branch, "master"

set :rails_env, 'production'

set :deploy_to, "/home/#{user}/apps/#{application}"
set :deploy_via, :remote_cache

default_run_options[:pty] = true

role :web, server
role :app, server
role :db,  server, :primary => true

after "deploy:update_code", "deploy:symlink_config"
after "deploy:update_code", "deploy:generate_tinymce_cache"
after 'deploy:update_code', "deploy:precompile_assets"
after "deploy",             "deploy:cleanup"
# after "deploy",             "deploy:build_missing_paperclip_styles"

namespace :deploy do
  desc "build missing paperclip styles"
  task :build_missing_paperclip_styles, :roles => :app do
    run "cd #{release_path}; RAILS_ENV=production bundle exec rake paperclip:refresh:missing_styles"
  end
  
  task :precompile_assets, :roles => :app do
    run "cd #{release_path} && rm -rf public/assets/*"
    run "cd #{release_path} && RAILS_ENV=production bundle exec rake assets:precompile"
  end
  
  task :symlink_config, :roles => :app, :except => {:no_release => true, :no_symlink => true} do
    run "ln -nsf #{shared_path}/config/database.yml #{current_release}/config"
  end
  
  task :generate_tinymce_cache, :roles => :app do
    run "cd #{current_release} && RAILS_ENV=production bundle exec rake tinymce:cache_js"
  end
  
  task :restart, :roles => :app, :except => { :no_release => true } do
    run "#{try_sudo} touch #{File.join(current_path,'tmp','restart.txt')}"
  end
end

