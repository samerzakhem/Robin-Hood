package nfuzion.message.navigation.type;
import nfuzion.message.generic.type.TypeClass;

/**
 * Waypoint object for navigation.  Waypoint can contain either a textual address
 * (Ex. "134 Main Street LaGrange, Georgia 30240") or gps coordinates.  If both
 * address and coordinates exist, the address will take precedence when processing
 * the waypoint.
 * 
 * @author Christopher George, Lee Becham
 */
class Waypoint extends TypeClass
{
   public var name:String;
   public var address:String;
   public var x:Float;
   public var y:Float;
   
   public function new(name:String, address:String, x = 0.0, y = 0.0) 
   {
      super();
      
      this.name = name;
      this.address = address;
      this.x = x;
      this.y = y;
   }
   

   public function toString():String {
      
      // return the data associated with this waypoint instance.
      
      // address takes precedence
      if (this.address.length > 0) {
         return this.address;
      }
      
      return Std.string(x) + "," + Std.string(y);
   } // getData
}