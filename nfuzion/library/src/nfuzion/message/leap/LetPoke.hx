package nfuzion.message.leap;
import nfuzion.message.generic.templates.Let;

/**
 * ...
 * @author Adam Williams
 */
class LetPoke extends Let
{
   public var x:Float;
   public var y:Float;
   public var fingerCount:Int;
   public var clickCount:Int;
   
   public function new(x:Float, y:Float, fingerCount:Int, clickCount:Int) 
   {
      super();
      
      this.x = x;
      this.y = y;
      this.fingerCount = fingerCount;
      this.clickCount = clickCount;
   }
}