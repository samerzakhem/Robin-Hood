package nfuzion.message.vehicle;
import nfuzion.message.generic.templates.Let;
import nfuzion.message.vehicle.type.TransmissionState;

/**
 * Report status of transmission.  
 * 
 * @author Lee Becham
 */
class LetTransmission extends Let
{
   // send status of transmission using enum type TransmissionState
   
   public var state:TransmissionState;
   
   public function new(state:TransmissionState) 
   {
      super();
      
      this.state = state;
   }   
   
}
