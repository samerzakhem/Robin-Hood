package nfuzion.message.pandora;
import nfuzion.message.generic.templates.Let;
import nfuzion.message.media.type.Item;

/**
 * ...
 * @author Adam Williams
 */

class LetCurrentChannel extends Let
{
   public var channel:Item;
   
   public function new(channel:Item) 
   {
      super();
      this.channel = channel;
   }
}