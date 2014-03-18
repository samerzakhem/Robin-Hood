package nfuzion.message.navigation;
import nfuzion.message.generic.templates.Set;
import nfuzion.message.navigation.type.Waypoint;

/**
 * ...
 * @author Christopher George
 */
class SetWaypoints extends Set
{
   public var waypoints:Array<Waypoint>;
   
   public function new(waypoints:Array<Waypoint>):Void
   {
      super();
      
      this.waypoints = waypoints;
   }
}