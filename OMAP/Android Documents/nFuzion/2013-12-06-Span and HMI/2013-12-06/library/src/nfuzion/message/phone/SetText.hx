package nfuzion.message.phone;
import nfuzion.message.generic.templates.Set;

/**
 * ...
 * @author Christopher George
 */
class SetText extends Set
{
   public var recipient:String;
   public var text:String;
   
   public function new(recipient:String, text:String) 
   {
      super();
      
      this.recipient = recipient;
      this.text = text;
   }
}