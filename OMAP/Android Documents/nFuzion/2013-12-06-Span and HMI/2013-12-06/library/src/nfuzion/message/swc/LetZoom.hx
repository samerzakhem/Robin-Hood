package nfuzion.message.swc;
import nfuzion.message.generic.templates.Let;

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

   public function new(deltaZoom:Float, fingerCount:Int) 
   {
      super();
      
      this.deltaZoom = deltaZoom;
      this.fingerCount = fingerCount;
   }
}