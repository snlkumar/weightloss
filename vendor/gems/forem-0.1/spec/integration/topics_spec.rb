require 'spec_helper'

describe "topics" do

  let(:forum) { Factory(:forum) }
  let(:topic) { Factory(:topic, :forum => forum) }
  let(:first_user) { Factory(:user, :login => 'first_forem_user') }
  let(:user) { Factory(:user, :login => 'other_forem_user', :email => "bob@boblaw.com") }
  let(:other_topic) { Factory(:topic, :subject => 'Another forem topic', :user => user, :forum => forum) }

  context "not signed in" do
    before do
      sign_out!
    end
    it "cannot create a new topic" do
      visit new_forum_topic_path(forum)
      flash_error!("You must sign in first.")
    end

    it "cannot delete topics" do
      delete forum_topic_path(topic.forum, topic), :id => topic.id.to_s
      response.should redirect_to(sign_in_path)
      flash[:error].should == "You must sign in first."
    end
  end

  context "signed in" do
    before do
      sign_in!
      visit new_forum_topic_path(forum)
    end

    context "creating a topic" do
      it "is valid with subject and post text" do
        fill_in "Subject", :with => "FIRST TOPIC"
        fill_in "Text", :with => "omgomgomgomg"
        click_button 'Create Topic'

        flash_notice!("This topic has been created.")
        assert_seen("FIRST TOPIC", :within => :topic_header)
        assert_seen("omgomgomgomg", :within => :post_text)
        assert_seen("forem_user", :within => :post_user)

      end

      it "is invalid without subject but with post text" do
        click_button 'Create Topic'

        flash_error!("This topic could not be created.")
        find_field("topic_subject").value.should eql("")
        find_field("topic_posts_attributes_0_text").value.should eql("")
      end

      it "does not keep flash error over requests" do
        click_button 'Create Topic'
        flash_error!("This topic could not be created.")
        visit root_path
        page.should_not have_content("This topic could not be created.")
      end
    end

    context "deleting a topic" do
      before do
        sign_in!
      end

      it "can delete their own topics" do
        visit forum_topic_path(topic.forum, topic)
        within(selector_for(:topic_menu)) do
          click_link("Delete")
        end
        flash_notice!("Your topic has been deleted.")
      end

      it "cannot delete topics by others" do
        first_user.id # Generate the first user that corresponds to the logged in user
        delete forum_topic_path(other_topic.forum, other_topic), :id => other_topic.id.to_s
        response.should redirect_to(forum_path(other_topic.forum))
        flash[:error].should == "You cannot delete a topic you do not own."
      end
    end

    context "creating a topic" do
      before do
        sign_in!
      end

      it "creates a view" do
        lambda do
          visit forum_topic_path(forum, topic)
        end.should change(Forem::View, :count).by(1)
      end

      it "increments a view" do
        # register a view
        visit forum_topic_path(forum, topic)
        
        # expect does not work as expected.
        # the view object is not reloaded when it's re-checked, but cached instead
        # Therefore we cannot do this:
        #
        # expect do
        #   visit forum_topic_path(forum, topic)
        # end.to change(view.reload, :count)
        # 
        # But instead must go long-form:

        view = ::Forem::View.last
        view.count.should eql(1)
        visit forum_topic_path(forum, topic)
        view.reload.count.should eql(2)
      end
    end
  end

  context "viewing a topic" do
    let(:topic) do
      Factory(:topic, :forum => forum, :user => user)
    end

    it "is free for all" do
      visit forum_topic_path(forum, topic)
      assert_seen(topic.subject, :within => :topic_header)
      assert_seen(topic.posts.first.text, :within => :post_text)
    end

    it "should show a gravatar" do
      visit forum_topic_path(forum, topic)
      assert page.has_selector?("div.icon > img[alt='Gravatar']")
    end
  end
end
