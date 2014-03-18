package nfuzion.message.vehicle;
import nfuzion.message.generic.templates.Let;
import nfuzion.message.vehicle.type.TransmissionState;

/**
 * Signal welcome screen  
 * 
 * @author Adam Williams
 */
class LetWelcome extends Let
{
   // send welcome greeting and name to be displayed
   
   public var title:String;
   public var subtitle:String;
   
   public function new(title:String, subtitle:String = null) 
   {
      super();
      
      this.title = title;
      this.subtitle = subtitle;
   }   
   
}
