package nfuzion.message.notice.type;
import nfuzion.message.generic.type.TypeClass;

/**
 * ...
 * @author Christopher George
 */
class Action extends TypeClass
{
   public var name:String;
   public var action:ActionType;
   public var data:String;
   
   public function new(name:String, action:ActionType, data:String = null) 
   {
      super();
      
      this.name = name;
      this.action = action;
      this.data = data;
   }
}