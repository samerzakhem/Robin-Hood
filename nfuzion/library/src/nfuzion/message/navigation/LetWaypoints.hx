package nfuzion.message.navigation;
import nfuzion.message.generic.templates.Let;
import nfuzion.message.navigation.type.Waypoint;

/**
 * ...
 * @author Christopher George
 */
class LetWaypoints extends Let
{
   public var waypoints:Array<Waypoint>;
   
   public function new(waypoints:Array<Waypoint>):Void
   {
      super();
      
      this.waypoints = waypoints;
   }
}