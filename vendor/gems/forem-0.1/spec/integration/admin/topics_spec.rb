require 'spec_helper'

describe "topics" do
  let(:forum) { Factory(:forum) }
  let(:topic) { Factory(:topic, :forum => forum) }
  let(:other_topic) { Factory(:topic, :forum => forum, :subject => "SECOND TOPIC") }

  before do
    sign_in! :admin => true
  end

  it "can hide a topic" do
    visit forum_topic_path(forum, topic)
    click_link "Hide"
    flash_notice!("This topic is now hidden.")

    sign_out!

    visit forum_topic_path(forum, topic)
    flash_error!("The topic you are looking for could not be found.")
  end

  it "can lock a topic" do
    visit forum_topic_path(forum, topic)
    click_link "Lock"
    flash_notice!("This topic is now locked.")

    sign_out!
    sign_in!

    visit forum_topic_path(forum, topic)
    page.should_not have_content("New Topic")
  end

  it "can pin a topic" do
    visit forum_topic_path(forum, topic)
    click_link "Pin"
    flash_notice!("This topic is now pinned.")

    other_topic # will create another topic, making it the top post unless the first topic is truly pinned
    visit forum_path(forum)
    page.all(".topics .subject").map(&:text).should == ["FIRST TOPIC", "SECOND TOPIC"]
  end
end