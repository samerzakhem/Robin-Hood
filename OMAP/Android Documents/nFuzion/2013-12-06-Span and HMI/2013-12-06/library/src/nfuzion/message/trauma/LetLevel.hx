package nfuzion.message.trauma;
import nfuzion.message.generic.templates.Let;
import nfuzion.message.trauma.type.TraumaLevel;

/**
 * ...
 * @author Christopher George
 */
class LetLevel extends Let
{
   public var level:TraumaLevel;
   
   public function new(level:TraumaLevel) 
   {
      super();
      
      this.level = level;
   }
}