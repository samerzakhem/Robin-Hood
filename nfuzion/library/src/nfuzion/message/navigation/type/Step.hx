package nfuzion.message.navigation.type;

import  nfuzion.message.navigation.type.SerializablePoint;
import nfuzion.message.generic.type.TypeClass;
import nfuzion.message.navigation.type.TransitType;

/**
 * 
 * @author Lee Becham
 */

class Step extends TypeClass
{
   public var distance:Float;                   // distance of this segment in meters
   public var startingPoint:SerializablePoint;  // GPS coordinate of the start of this segment
   public var endingPoint:SerializablePoint;    // GPS coordinate of the end of this segment
   public var track:Array<SerializablePoint>;   // Array of GPS coordinates between starting and ending points
   public var text:String;                      // HTML text associated with this segment
   public var type:TransitType;                 // transit type (walking, driving)
   
   public function new(distance:Float = 0.0, 
                       sp:SerializablePoint = null, 
                       ep:SerializablePoint = null, 
                       track:Array<SerializablePoint> = null, 
                       text:String = "", 
                       ?type:TransitType) {
      
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

      if (track == null) {
         this.track = new Array<SerializablePoint>();
      }
      else {
         this.track = track;
      }
      
      this.text = text;
      
      if (type == null) {
         this.type = TransitType.driving;
      }
      else {
         this.type = type;
      }
   }

}