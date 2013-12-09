package nfuzion.message.pandora;
import nfuzion.message.generic.templates.Let;
import nfuzion.message.media.type.Item;

/**
 * ...
 * @author Robert Sturtz
 */
class LetCurrentItem extends Let
{
   public var item:Item;
   
   
   public function new(item:Item) 
   {
      super();
      
      this.item = item;
   }
}