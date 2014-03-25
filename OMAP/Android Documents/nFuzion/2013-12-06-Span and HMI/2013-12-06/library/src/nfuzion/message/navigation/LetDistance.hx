package nfuzion.message.navigation;
import nfuzion.message.generic.templates.LetFloat;
import nfuzion.message.navigation.type.TargetType;

/**
 * Message for sending new Distance data for routes
 * 
 * @author Lee Becham
 */

class LetDistance extends LetFloat
{
   // Distance in meters.
   
   public function new(distance:Float) 
   {
      super(distance);
   }
}