package nfuzion.message.navigation;
import nfuzion.message.navigation.type.TransitType;
import nfuzion.message.generic.templates.Set;

/**
 * Message sent across span to tell Navigation Service to request a new route
 * 
 * @author Lee Becham
 */

class SetRequestNewRoute extends Set {
   
   public var type:TransitType;
   
   public function new(type:TransitType):Void {
      
      // message to request a new route
      
      super();
      this.type = type;
   }
}