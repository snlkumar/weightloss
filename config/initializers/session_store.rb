# Be sure to restart your server when you modify this file.

# Your secret key for verifying cookie session data integrity.
# If you change this key, all old sessions will become invalid!
# Make sure the secret is at least 30 characters and all random, 
# no regular words or you'll be exposed to dictionary attacks.
ActionController::Base.session = {
  :key         => '_myweightworld_session',
  :secret      => '3602766fa7ebcc300b12cf5668c86d4148555ef51ef679df0429641885166beb7df3ee951d62b6b9224911d00fa216c82620ad37df1377068486a10817fc3aa2'
}

# Use the database for sessions instead of the cookie-based default,
# which shouldn't be used to store highly confidential information
# (create the session table with "rake db:sessions:create")
# ActionController::Base.session_store = :active_record_store
