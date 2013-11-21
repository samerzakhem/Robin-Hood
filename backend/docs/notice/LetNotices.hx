package nfuzion.message.notice;
import nfuzion.message.generic.templates.Let;
import nfuzion.message.notice.type.Notice;

/**
 * ...
 * @author Christopher George
 * @author Robert Sturtz
 */
class LetNotices extends Let
{
   public var start:Int;
   public var notices:Array<Notice>;
   
   public function new(start:Int, notices:Array<Notice>)
   {
      super();
      
      this.start = start;
      this.notices = notices;
   }
}