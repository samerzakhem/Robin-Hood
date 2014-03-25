package nfuzion.message.touch;
import nfuzion.message.generic.templates.Let;
import nfuzion.message.touch.type.Phase;

/**
 * ...
 * @author Christopher George
 */
class LetZoom extends Let
{
   /**
    * Zoom ratio delta.  A pinch is indicated when less than one, and a
    * spread is indicated when greater than one.
    */
   public var deltaZoom:Float;
   public var fingerCount:Int;
   public var phase:Phase;

   public function new(deltaZoom:Float, fingerCount:Int, phase:Phase) 
   {
      super();
      
      this.deltaZoom = deltaZoom;
      this.fingerCount = fingerCount;
      this.phase = phase;
   }
}