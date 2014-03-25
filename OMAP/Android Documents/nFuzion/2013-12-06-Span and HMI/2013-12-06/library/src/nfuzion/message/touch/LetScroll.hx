package nfuzion.message.touch;
import nfuzion.message.generic.templates.Let;
import nfuzion.message.touch.type.Phase;

/**
 * ...
 * @author Adam Williams
 */
class LetScroll extends Let
{
   /*
    * Change in X since last report, measured in pixels.
    */
   public var deltaX:Float;
   /*
    * Change in Y since last report, measured in pixels.
    */
   public var deltaY:Float;
   /*
    * X velocity measured in pixels-per-second.
    */
   public var velocityX:Float;
   /*
    * Y velocity measured in pixels-per-second.
    */
   public var velocityY:Float;
   public var phase:Phase;
   public var fingerCount:Int;
   
   public function new(deltaX:Float, deltaY:Float, velocityX:Float, velocityY:Float, phase:Phase, fingerCount:Int) 
   {
      super();
      
      this.deltaX = deltaX;
      this.deltaY = deltaY;
      this.velocityX = velocityX;
      this.velocityY = velocityY;
      this.phase = phase;
      this.fingerCount = fingerCount;
   }
}