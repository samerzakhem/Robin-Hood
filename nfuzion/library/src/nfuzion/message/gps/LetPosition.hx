package nfuzion.message.gps;

import nfuzion.message.generic.templates.Let;

/**
 * ...
 * @author Christopher George
 */
class LetPosition extends Let
{
   public var latitude:Float;
   public var longitude:Float;
   
   public function new(latitude:Float, longitude:Float) 
   {
      super();
      
      this.latitude = latitude;
      this.longitude = longitude;
   }
}
