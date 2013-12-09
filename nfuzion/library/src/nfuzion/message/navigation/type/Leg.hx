package nfuzion.message.navigation.type;

import nfuzion.message.navigation.type.SerializablePoint;
import nfuzion.message.generic.type.TypeClass;


/**
 * A leg within a route is the major portion between starting and ending points.
 * In most cases, a leg will be the entire route.  However, in cases where
 * waypoints have been inserted into the route, a leg will be the portion of 
 * information between the start/destination points and each waypoint.
 * 
 * @author Lee Becham
 */

class Leg extends TypeClass
{
   public var distance:Float;                   // distance of this segment in meters
   public var startingPoint:SerializablePoint;  // GPS coordinate of the start of this segment
   public var endingPoint:SerializablePoint;    // GPS coordinate of the end of this segment
   public var steps:Array<Step>;                // Array of GPS coordinates between starting and ending points
   
   public function new(distance:Float = 0.0, sp:SerializablePoint = null, ep:SerializablePoint = null, steps:Array<Step> = null) {
      
      // constructor
      
      super();
      
      this.distance = distance;
      
      if (sp == null) {
         this.startingPoint = new SerializablePoint();
      }
      else  {
         this.startingPoint = sp;
      }
      
      if (ep == null) {
         this.endingPoint = new SerializablePoint();
      }
      else {
         this.endingPoint = ep;
      }

      if (steps == null) {
         this.steps = new Array<Step>();
      }
      else {
         this.steps = steps;
      } 
   }

}