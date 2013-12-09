package nfuzion.message.navigation;
import nfuzion.message.generic.templates.Let;
import nfuzion.message.navigation.type.StepData;

/**
 * ...
 * @author Christopher George
 */
class LetNextTurn extends Let
{
   // Distance in meters.
   public var nextTurn:StepData;   
   
   public function new(nextTurn:StepData) 
   {
      super();
      
      this.nextTurn = nextTurn;
   }
}