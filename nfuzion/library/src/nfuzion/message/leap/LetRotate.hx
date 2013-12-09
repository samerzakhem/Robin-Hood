package nfuzion.message.leap;
import nfuzion.message.generic.templates.Let;

/**
 * ...
 * @author Christopher George
 */
class LetRotate extends Let
{
   public var deltaAngle:Float;
   public var fingerCount:Int;

   public function new(deltaAngle:Float, fingerCount:Int) 
   {
      super();
      
      this.deltaAngle = deltaAngle;
      this.fingerCount = fingerCount;
   }
}