package nfuzion.message.pandora;
import nfuzion.message.generic.templates.Let;
import nfuzion.message.media.type.TransportAction;

/**
 * ...
 * @author Robert Sturtz
 */
class LetTransportAction extends Let
{
   public var action:TransportAction;
   
   public function new(action:TransportAction) 
   {
      super();
      
      this.action = action;
   }
}