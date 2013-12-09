package nfuzion.message.navigation.type;

import nfuzion.message.generic.type.TypeClass;
import nfuzion.message.navigation.type.TargetType;

/**
 * 
 * @author Robert Sturtz
 */

class StepData extends TypeClass
{
	public var distance:Float;                   // distance of this segment in meters
	public var turn:String;						 // turn direction string
	public var target:TargetType;				 // enum value associated with the turn string
	public var street:String;					 // street name string
	public var destination:String;				 // Copy of the destination string from Google
   public var isLastStep:Bool;					 // "true" if this is the last step in the current leg
	public var isLastLeg:Bool;					 // "true" if this is the last leg in the current route
	
	public function new(target:TargetType = null, distance:Float = 0, street:String = null) 
   {
      
      super();
      
     this.distance = distance;
	  this.street = street;
	  this.target = target;
     turn = null;
	  destination = null;
	  isLastStep = false;
	  isLastLeg = false;
	  
   }

}