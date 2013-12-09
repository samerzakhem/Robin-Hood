package nfuzion.message.phone.type;
import nfuzion.message.generic.type.TypeClass;

/**
 * ...
 * @author Christopher George
 */
class Time extends TypeClass
{
   public var year:Int;
   public var month:Int;
   public var day:Int;
   // Time of day is in seconds.
   public var time:Float;
   
   public function new(year:Int, month:Int, day:Int, time:Float) 
   {
      super();
      
      this.year = year;
      this.month = month;
      this.day = day;
      this.time = time;
   }
}