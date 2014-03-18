package nfuzion.message.swc;
import nfuzion.message.generic.templates.Let;
import nfuzion.message.swc.type.Phase;

/**
 * ...
 * @author Adam Williams
 */
class LetCursor extends Let
{
   public var x:Float;
   public var y:Float;
   public var phase:Phase;
   
   public function new(x:Float, y:Float, phase:Phase) 
   {
      super();
      
      this.x = x;
      this.y = y;
      this.phase = phase;
   }
}