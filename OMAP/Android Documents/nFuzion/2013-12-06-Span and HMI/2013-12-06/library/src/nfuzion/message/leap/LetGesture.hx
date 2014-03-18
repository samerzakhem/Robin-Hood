package nfuzion.message.leap;
import nfuzion.message.generic.templates.Let;
import nfuzion.message.leap.type.Gesture;

/**
 * ...
 * @author Christopher George
 */
class LetGesture extends Let
{
   public var gesture:Gesture;
   
   public function new(gesture:Gesture) 
   {
      super();
      
      this.gesture = gesture;
   }
}