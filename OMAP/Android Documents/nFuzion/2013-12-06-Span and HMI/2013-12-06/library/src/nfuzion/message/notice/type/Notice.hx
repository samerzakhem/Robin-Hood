package nfuzion.message.notice.type;
import nfuzion.message.generic.type.TypeClass;

/**
 * ...
 * @author Christopher George
 */
class Notice extends TypeClass
{
   public var title:String;
   public var text:String;
   public var options:Array<Action>;
   public var type:NoticeType;
   public var priority:NoticePriority;
   public var eventData:EventData;
   // Ignored when creating a notice.
   public var id:Int;
   
   public function new(title:String, text:String, type:NoticeType, priority:NoticePriority, options:Array<Action> = null, eventData:EventData = null) 
   {
      super();
      
      this.title = title;
      this.text = text;
      this.type = type;
      this.priority = priority;
      this.options = options;
      this.eventData = eventData;
      if (this.options == null)
      {
         this.options = new Array<Action>();
      }
      id = 0;
   }
}