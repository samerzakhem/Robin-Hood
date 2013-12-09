package nfuzion.message.navigation;
import nfuzion.message.generic.templates.Set;

/**
 * Message send across span to tell Navigation Service to clear contents of current route.
 * 
 * @author Lee Becham
 */

class SetClearRoute extends Set {
   
   public function new():Void {
      
      // message to Clear existing route
      
      super();
   }
}