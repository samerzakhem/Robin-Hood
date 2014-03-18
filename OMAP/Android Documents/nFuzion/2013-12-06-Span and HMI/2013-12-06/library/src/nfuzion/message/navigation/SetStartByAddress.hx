package nfuzion.message.navigation;
import nfuzion.geometry.Point;
import nfuzion.message.generic.templates.SetString;

/**
 * Message sent across span to tell Navigation Service to set the starting point of
 * a new navigation using an address
 * 
 * @author Lee Becham
 */

class SetStartByAddress extends SetString {
   
   public function new(start:String):Void {
      
      // message to set start point via address
      
      super(start);
   }
}