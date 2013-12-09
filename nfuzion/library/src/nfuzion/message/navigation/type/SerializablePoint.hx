package nfuzion.message.navigation.type;
import nfuzion.message.generic.type.TypeClass;

/**
 * Serializable Point class.
 * 
 * @author Lee Becham
 */

class SerializablePoint extends TypeClass
{
   public var x:Float;
   public var y:Float;
   
   public function new(x = 0.0, y = 0.0) 
   {
      super();
      
      this.x = x;
      this.y = y;
   }
}