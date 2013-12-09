package nfuzion.message.swc;
import nfuzion.message.generic.templates.Let;
import nfuzion.message.leap.type.Phase;

/**
 * ...
 * @author Christopher George
 */
class LetButton extends Let
{
   public var name:String;
   public var phase:Phase;
   
   public function new(name:String, phase:Phase) 
   {
      super();
      
      this.name = name;
      this.phase = phase;
   }
}