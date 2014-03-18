package nfuzion.message.navigation;
import nfuzion.geometry.Point;
import nfuzion.message.generic.templates.Set;

/**
 * Message send across span to tell Navigation Service to set the ending point of
 * a new navigation using a GPS coordinate point.
 * 
 * @author Lee Becham
 */

class SetEndByPoint extends Set {
   
   public var x:Float;
   public var y:Float;
   
   
   public function new(x:Float, y:Float):Void {
      
      // message to set end point via Point
      
      super();
      
      this.x = x;
      this.y = y;
   }
}