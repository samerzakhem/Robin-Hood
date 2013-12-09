package nfuzion.message.pandora;
import nfuzion.message.media.type.TransportAction;
import nfuzion.message.generic.templates.Set;

/**
 * ...
 * @author Robert Sturtz	
 */

class SetTransportAction extends Set
{
   public var action:TransportAction;
   
   public function new(action:TransportAction) 
   {
      super();
      
      this.action = action;
   }
}