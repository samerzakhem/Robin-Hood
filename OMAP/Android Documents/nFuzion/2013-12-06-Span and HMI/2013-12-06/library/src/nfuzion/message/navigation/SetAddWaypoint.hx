package nfuzion.message.navigation;
import nfuzion.message.navigation.type.Waypoint;
import nfuzion.message.generic.templates.Set;

/**
 * Message send across span to tell Navigation Service to set a waypoint
 * in the route.
 * 
 * @author Lee Becham
 */

class SetAddWaypoint extends Set {
   
   public var waypoint:Waypoint;
   
   public function new(waypoint:Waypoint):Void {
      
      // message to add a waypoint
      
      super();
      
      this.waypoint = waypoint;
   }
}