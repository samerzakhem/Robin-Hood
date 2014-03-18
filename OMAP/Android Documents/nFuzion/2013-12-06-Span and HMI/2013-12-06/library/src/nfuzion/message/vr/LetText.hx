package nfuzion.message.vr;
import nfuzion.message.generic.templates.Let;
import nfuzion.message.generic.templates.LetString;

/**
 * ...
 * @author Steve Mobley
 * 
 * VR - return the translated text
 */

class LetText extends LetString
{
   // Value from 0 to 1, where 1 is 100%.
   public var confidence:Float;
   
   public function new(value:String, confidence:Float)
   {
      super(value);
      
      this.confidence = confidence;
   }
}