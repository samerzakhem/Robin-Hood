package nfuzion.message.phone;
import nfuzion.message.generic.templates.Set;
import nfuzion.message.phone.type.PhoneAction;

/**
 * ...
 * @author Christopher George
 */
class SetAction extends Set
{
   public var action:PhoneAction;
   public var number:String;
   
   public function new(action:PhoneAction, number:String) 
   {
      super();
      
      this.action = action;
      this.number = number;
   }
}