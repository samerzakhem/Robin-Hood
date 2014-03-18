package nfuzion.message.navigation;
import nfuzion.message.generic.templates.LetFloat;
import nfuzion.message.navigation.type.TargetType;

/**
 * Message for sending new Distance percentage data for current target
 * 
 * @author Lee Becham
 */

class LetDistancePercentage extends LetFloat
{
   // percentage in the range of [0..1]
   
   public function new(distance:Float) 
   {
      super(distance);
   }
}