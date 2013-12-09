package nfuzion.message.notice.type;
import nfuzion.message.generic.type.TypeClass;

/**
 * ...
 * @author Christopher George
 */
class EventData extends TypeClass
{
   public var name:String;
   public var locationName:String;
   public var time:String;
   public var contactName:String;
   public var contactNumber:String;
   
   public function new(name:String, locationName:String, time:String, contactName:String, contactNumber:String) 
   {
      super();
      
      this.name = name;
      this.locationName = locationName;
      this.time = time;
      this.contactName = contactName;
      this.contactNumber = contactNumber;
   }
}