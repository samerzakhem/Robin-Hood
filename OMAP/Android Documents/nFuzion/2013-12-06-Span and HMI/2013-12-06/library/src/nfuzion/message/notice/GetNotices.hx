package nfuzion.message.notice;
import nfuzion.message.generic.templates.Get;

/**
 * ...
 * @author Christopher George
 */
class GetNotices extends Get
{
   public var start:Int;
   public var end:Int;
   
   public function new(start:Int, end:Int) 
   {
      super();
      
      this.start = start;
      this.end = end;
   }
}