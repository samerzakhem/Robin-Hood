package nfuzion.message.proximity;
import nfuzion.message.generic.templates.Let;
import nfuzion.message.proximity.type.Proximity;

/**
 * ...
 * @author Christopher George
 */
class LetProximity extends Let
{
   public var name:String;
   public var proximity:Proximity;
   
   public function new(name:String, proximity:Proximity) 
   {
      super();
      
      this.name = name;
      this.proximity = proximity;
   }
}