package nfuzion.message.vehicle;
import nfuzion.message.generic.templates.Let;
import nfuzion.message.vehicle.type.TurnSignalState;

/**
 * Report turn signal status.
 * 
 * @author Lee Becham
 */
class LetTurnSignal extends Let
{
   // Report turn signal status using enum TurnSignalState
   
   public var state:TurnSignalState;
   
   public function new(state:TurnSignalState) 
   {
      super();
      
      this.state = state;
   }   
}
