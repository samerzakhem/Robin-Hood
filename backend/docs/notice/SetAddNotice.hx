package nfuzion.message.notice;
import nfuzion.message.generic.templates.Set;
import nfuzion.message.notice.type.Notice;

/**
 * ...
 * @author Christopher George
 */
class SetAddNotice extends Set
{
   public var notice:Notice;
   
   public function new(notice:Notice) 
   {
      super();
      
      this.notice = notice;
   }
}