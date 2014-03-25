package nfuzion.message.navigation;
import nfuzion.message.generic.templates.Set;

/**
 * Message sent across span to tell Navigation Service to remove a waypoint
 * from the route.
 * 
 * @author Lee Becham
 */

class SetRemoveWaypoint extends Set {
   
   public var index:Int;
   
   public function new(index:Int):Void {
      
      // message to remove a waypoint
      
      super();
      
      this.index = index;
   }
}