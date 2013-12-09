package nfuzion.message.navigation;
import nfuzion.message.generic.templates.Let;
import nfuzion.message.navigation.type.Route;

/**
 * Send complete route point-to-point GPS data as array of points.
 * 
 * @author Lee Becham
 */

class LetRoute extends Let
{
   // route in string format... may change if needed
   public var route:Route;
   
   public function new(route:Route) 
   {
      super();
      
      this.route = route;
   }
}