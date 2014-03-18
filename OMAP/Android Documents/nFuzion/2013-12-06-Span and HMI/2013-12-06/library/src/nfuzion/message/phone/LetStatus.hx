package nfuzion.message.phone;

import nfuzion.message.generic.templates.Let;
import nfuzion.message.phone.type.PhoneStatus;

/**
 * ...
 * @author Christopher George
 */
class LetStatus extends Let
{
   public var status:PhoneStatus;
   public var number:String;
   
   public function new(status:PhoneStatus, number:String = null) 
   {
      super();
      this.status = status;
      this.number = number;
   }
}