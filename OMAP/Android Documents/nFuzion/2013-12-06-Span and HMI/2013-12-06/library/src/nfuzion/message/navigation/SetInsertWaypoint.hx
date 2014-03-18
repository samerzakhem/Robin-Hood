package nfuzion.message.navigation;
import nfuzion.message.navigation.type.Waypoint;
import nfuzion.message.generic.templates.Set;

/**
 * Message sent across span to tell Navigation Service to insert a waypoint
 * in the route.
 * 
 * @author Lee Becham
 */

class SetInsertWaypoint extends Set {
   
   public var index:Int;
   public var waypoint:Waypoint;
   
   public function new(index:Int, waypoint:Waypoint):Void {
      
      // message to insert a waypoint
      
      super();
      
      this.index = index;
      this.waypoint = waypoint;
   }
}