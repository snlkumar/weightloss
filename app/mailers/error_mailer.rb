class ErrorMailer < ActionMailer::Base
  #default :from => "from@example.com"
=begin
  def snapshot(exception, clean_backtrace, data, params, req, sent_at = Time.now)
      @subject = exception
      @recipients = 'harish@idifysolutions.com'
      @from = 'harish@idifysolutions.com'
      @sent_on = sent_at
      @body = data
   end
=end
end
