class MeasurementGrapher < Grapher
  attr_accessor :ruby_data
  
  def initialize(range, user)
    @dates             = dates_for_graph(range)
    
    @height_for_dates = date_to_height_mapping(user.measurements.reverse)
    @chest_for_dates = date_to_chest_mapping(user.measurements.reverse)
    @uparmright_for_dates = date_to_uparmright_mapping(user.measurements.reverse)
    @forearmright_for_dates = date_to_forearmright_mapping(user.measurements.reverse)
    @hips_for_dates = date_to_hips_mapping(user.measurements.reverse)
    @thighright_for_dates = date_to_thighright_mapping(user.measurements.reverse)
    @calfright_for_dates = date_to_calfright_mapping(user.measurements.reverse)
    @calfleft_for_dates = date_to_calfleft_mapping(user.measurements.reverse)
    @thighleft_for_dates = date_to_thighleft_mapping(user.measurements.reverse)
    @waist_for_dates = date_to_waist_mapping(user.measurements.reverse)
    @forearmleft_for_dates = date_to_forearmleft_mapping(user.measurements.reverse)
    @uparmleft_for_dates = date_to_uparmleft_mapping(user.measurements.reverse)
    @neck_for_dates = date_to_neck_mapping(user.measurements.reverse)
    
    @ruby_data         = []

  end
  
  def js_height_data
    "[ #{ populate(@dates.clone, @height_for_dates) } ]"
  end
  
  def js_chest_data
    "[ #{ populate(@dates.clone, @chest_for_dates) } ]"
  end
  
  def js_uparmright_data
    "[ #{ populate(@dates.clone, @uparmright_for_dates) } ]"
  end
  
  def js_forearmright_data
    "[ #{ populate(@dates.clone, @forearmright_for_dates) } ]"
  end  
  
  def js_hips_data
    "[ #{ populate(@dates.clone, @hips_for_dates) } ]"
  end
  
  def js_thighright_data
    "[ #{ populate(@dates.clone, @thighright_for_dates) } ]"
  end
  
  def js_calfright_data
    "[ #{ populate(@dates.clone, @calfright_for_dates) } ]"
  end   
  
  def js_calfleft_data
    "[ #{ populate(@dates.clone, @calfleft_for_dates) } ]"
  end  
  
  def js_thighleft_data
    "[ #{ populate(@dates.clone, @thighleft_for_dates) } ]"
  end
  
  def js_waist_data
    "[ #{ populate(@dates.clone, @waist_for_dates) } ]"
  end
  
  def js_forearmleft_data
    "[ #{ populate(@dates.clone, @forearmleft_for_dates) } ]"
  end  
  
  def js_uparmleft_data
    "[ #{ populate(@dates.clone, @uparmleft_for_dates) } ]"
  end
  
  def js_neck_data
    "[ #{ populate(@dates.clone, @neck_for_dates) } ]"
  end  
  

  def populate(blanks, fills)
    blanks.each_with_index do |day, index|
      if fills[day.strftime("%b %d %Y")]
        blanks[index] = "[ #{day.to_i * 1000}, #{fills[day.strftime("%b %d %Y")]}]"
        @ruby_data << [day.to_i * 1000, fills[day.strftime("%b %d %Y")]]
      else
        blanks[index] = nil
      end
    end
    blanks.compact.join(', ')
  end
  
  
   def date_to_height_mapping(measurements)
    # creates a date to weight mapping
    temp = {}
    measurements.each do |measurement|
      key       = measurement.created_at.strftime("%b %d %Y")
      temp[key] = measurement.height
    end
    temp 
  end
  
  def date_to_chest_mapping(measurements)
    # creates a date to weight mapping
    temp = {}
    measurements.each do |measurement|
      key       = measurement.created_at.strftime("%b %d %Y")
      temp[key] = measurement.chest
    end
    temp 
  end
  
   def date_to_uparmright_mapping(measurements)
    # creates a date to weight mapping
    temp = {}
    measurements.each do |measurement|
      key       = measurement.created_at.strftime("%b %d %Y")
      temp[key] = measurement.uparmright
    end
    temp 
  end
  
    def date_to_forearmright_mapping(measurements)
    # creates a date to weight mapping
    temp = {}
    measurements.each do |measurement|
      key       = measurement.created_at.strftime("%b %d %Y")
      temp[key] = measurement.forearmright
    end
    temp 
  end
  
    def date_to_hips_mapping(measurements)
    # creates a date to weight mapping
    temp = {}
    measurements.each do |measurement|
      key       = measurement.created_at.strftime("%b %d %Y")
      temp[key] = measurement.hips
    end
    temp 
  end
  
    def date_to_thighright_mapping(measurements)
    # creates a date to weight mapping
    temp = {}
    measurements.each do |measurement|
      key       = measurement.created_at.strftime("%b %d %Y")
      temp[key] = measurement.thighright
    end
    temp 
  end
  
    def date_to_calfright_mapping(measurements)
    # creates a date to weight mapping
    temp = {}
    measurements.each do |measurement|
      key       = measurement.created_at.strftime("%b %d %Y")
      temp[key] = measurement.calfright
    end
    temp 
  end
  
    def date_to_calfleft_mapping(measurements)
    # creates a date to weight mapping
    temp = {}
    measurements.each do |measurement|
      key       = measurement.created_at.strftime("%b %d %Y")
      temp[key] = measurement.calfleft
    end
    temp 
  end
  
    def date_to_thighleft_mapping(measurements)
    # creates a date to weight mapping
    temp = {}
    measurements.each do |measurement|
      key       = measurement.created_at.strftime("%b %d %Y")
      temp[key] = measurement.thighleft
    end
    temp 
  end
  
    def date_to_waist_mapping(measurements)
    # creates a date to weight mapping
    temp = {}
    measurements.each do |measurement|
      key       = measurement.created_at.strftime("%b %d %Y")
      temp[key] = measurement.waist
    end
    temp 
  end
  
    def date_to_forearmleft_mapping(measurements)
    # creates a date to weight mapping
    temp = {}
    measurements.each do |measurement|
      key       = measurement.created_at.strftime("%b %d %Y")
      temp[key] = measurement.forearmleft
    end
    temp 
  end
  
    def date_to_uparmleft_mapping(measurements)
    # creates a date to weight mapping
    temp = {}
    measurements.each do |measurement|
      key       = measurement.created_at.strftime("%b %d %Y")
      temp[key] = measurement.uparmleft
    end
    temp 
  end
  
    def date_to_neck_mapping(measurements)
    # creates a date to weight mapping
    temp = {}
    measurements.each do |measurement|
      key       = measurement.created_at.strftime("%b %d %Y")
      temp[key] = measurement.neck
    end
    temp 
  end 
  
end
