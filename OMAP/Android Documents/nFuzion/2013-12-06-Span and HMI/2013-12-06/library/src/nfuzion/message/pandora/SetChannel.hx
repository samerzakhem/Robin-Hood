package nfuzion.message.pandora;
import nfuzion.message.generic.templates.Set;
/**
 * ...
 * @author Robert Sturtz
 */

class SetChannel extends Set
{
   public var id:Int;
   
   public function new(id:Int) 
   {
      super();
      this.id = id;
   }
}