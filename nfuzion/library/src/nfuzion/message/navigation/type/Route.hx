package nfuzion.message.navigation.type;

//import nfuzion.geometry.Point;
import nfuzion.message.navigation.type.Waypoint;
import nfuzion.message.navigation.type.TransitType;
import nfuzion.message.navigation.type.Leg;
import nfuzion.message.navigation.type.Step;
import nfuzion.message.generic.type.TypeClass;
import Array;

/**
 * Route information - result of a createRoute() call.
 * 
 * @author Lee Becham
 */

class Route extends TypeClass {
   
   // encapsulation of route data
   
   // markers - includes starting point GPS coordinates, ending point GPS coordinates, and 
   // any included waypoint GPS coordinates.
   public var markers:Array<Waypoint>; 
   
   // array of each leg's data
   public var legs:Array<Leg>;
   
   public var distance:Float;       // Total distance for the route
   
   
   public function new(markers:Array<Waypoint> = null, legs:Array<Leg> = null, distance:Float = 0.0) {
      
      // constructor
      
      super();
      
      if(markers == null) {
         this.markers = new Array<Waypoint>();
      }
      else {
         this.markers = markers;
      }
      
      if (legs == null) {
         this.legs = new Array<Leg>();
      }
      else {
         this.legs = legs;
      } 
      
      this.distance = distance;
   }
   

   public function addMarker(point:Waypoint) : Void {
      
      // add a marker to the array of markers
      
      markers.push(point);
   }
   
   
   public function getTextDirections() : Array<String> {
      
      // return an array of the HTML directions.
      
      if (legs == null) {
         return null;
      }
      
      var directions:Array<String> = new Array<String>();
      
      for (l in legs) {
         for (s in l.steps) {
            directions.push(s.text);
         }
      }
      
      return directions;
   }
   
   
}