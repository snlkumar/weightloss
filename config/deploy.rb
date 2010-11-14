server = "184.106.134.129" 
set :port, 6969

set :user,      'deploy'
set :password,  'rails4myweightworld'
set :application, "myweightworld"
set :deploy_to, "/home/#{user}/apps/#{application}"
set :rails_env, 'production'

role :web, server
role :app, server
role :db,  server, :primary => true

default_run_options[:pty] = true

set :repository,  "git@myweightworld.unfuddle.com:myweightworld/myww.git"
set :scm, "git"

set :deploy_via, :remote_cache

set :use_sudo,  false

after "deploy:update_code", "deploy:symlink_config"
after "deploy",             "deploy:cleanup"
# after "deploy:symlink",     "deploy:update_crontab"


deploy.task :symlink_config, :roles => :app, :except => {:no_release => true, :no_symlink => true} do
  run "ln -nsf #{shared_path}/config/database.yml #{current_release}/config"
  # run "cd #{current_release} && RAILS_ENV=production rake db:migrate --trace"
end

deploy.task :restart do
  run "mkdir -p #{current_release}/tmp"
  run "touch #{current_release}/tmp/restart.txt"
end

Dir[File.join(File.dirname(__FILE__), '..', 'vendor', 'gems', 'hoptoad_notifier-*')].each do |vendored_notifier|
  $: << File.join(vendored_notifier, 'lib')
end

require 'hoptoad_notifier/capistrano'
