class AddUrlToTextFiles < ActiveRecord::Migration
  def self.up
    add_column :old_text_files, :url, :string rescue nil
    add_column :old_text_files, :author, :string rescue nil
    add_column :old_flash_files, :vendor_name, :string rescue nil
    add_column :old_items, :title, :string rescue nil
    add_column :old_items, :inventory, :integer rescue nil
    add_column :old_items, :warning_qty, :integer rescue nil
    add_column :old_items, :on_sale, :boolean rescue nil
    add_column :old_items, :on_msrp, :boolean rescue nil
    add_column :old_items, :tax_exempt, :boolean rescue nil
    add_column :old_items, :free_shipping, :boolean rescue nil
    add_column :old_items, :shipping_1st_item, :decimal rescue nil
    add_column :old_items, :shipping_2nd_item, :decimal rescue nil
    add_column :old_items, :country_unit, :string rescue nil
    add_column :old_items, :active, :boolean rescue nil
    add_column :old_items, :featured, :boolean rescue nil
    add_column :old_items, :best_seller, :boolean rescue nil
    add_column :old_items, :latest_and_greatest, :boolean rescue nil
    add_column :old_items, :recommended, :boolean rescue nil
    add_column :old_items, :column_name, :string rescue nil
    add_column :old_items, :additional_features, :string rescue nil
    
    add_column :old_items, :image2_file_size, :integer rescue nil
    add_column :old_items, :image2_updated_at, :datetime rescue nil
    add_column :old_items, :image2_file_name, :string rescue nil
    add_column :old_items, :image2_content_type, :string rescue nil
    add_column :old_items, :category_id, :integer rescue nil
    add_column :old_items, :subcategory_id, :integer rescue nil
  end

  def self.down
    remove_column :old_items, :subcategory_id rescue nil
    remove_column :old_items, :category_id rescue nil
    remove_column :old_items, :image2_content_type rescue nil
    remove_column :old_items, :image2_file_name rescue nil
    remove_column :old_items, :image2_updated_at rescue nil
    remove_column :old_items, :image2_file_size rescue nil
    
    remove_column :old_items, :additional_features rescue nil
    remove_column :old_items, :column_name rescue nil
    remove_column :old_items, :recommended rescue nil
    remove_column :old_items, :latest_and_greatest rescue nil
    remove_column :old_items, :best_seller rescue nil
    remove_column :old_items, :featured rescue nil
    remove_column :old_items, :active rescue nil
    remove_column :old_items, :subcategory_id rescue nil
    remove_column :old_items, :category_id rescue nil
    remove_column :old_items, :country_unit rescue nil
    remove_column :old_items, :shipping_2nd_item rescue nil
    remove_column :old_items, :shipping_1st_item rescue nil
    remove_column :old_items, :free_shipping rescue nil
    remove_column :old_items, :tax_exempt rescue nil
    remove_column :old_items, :on_msrp rescue nil
    remove_column :old_items, :on_sale rescue nil
    remove_column :old_items, :warning_qty rescue nil
    remove_column :old_items, :inventory rescue nil
    remove_column :old_items, :title rescue nil
    remove_column :old_flash_files, :vendor_name rescue nil
    remove_column :old_text_files, :author rescue nil
    remove_column :old_text_files, :url rescue nil
  end
end