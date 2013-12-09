package nfuzion.message.pandora;
import nfuzion.message.generic.templates.Let;

/**
 * ...
 * @author Christopher George
 */
class LetStatus extends Let
{
   public var count:Int;
   
   public function new(count:Int) 
   {
      super();
      
      this.count = count;
   }
}