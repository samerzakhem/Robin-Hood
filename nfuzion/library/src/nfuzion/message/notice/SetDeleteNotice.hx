package nfuzion.message.notice;
import nfuzion.message.generic.templates.Set;

/**
 * ...
 * @author Christopher George
 */
class SetDeleteNotice extends Set
{
   public var id:Int;
   
   public function new(id:Int) 
   {
      super();
      
      this.id = id;
   }
}