package nfuzion.message.chime;
import nfuzion.message.chime.type.Chime;
import nfuzion.message.generic.templates.Set;

/**
 * ...
 * @author Christopher George
 */
class SetChime extends Set
{
   public var chime:Chime;
   public var playCount:Int;
   
   public function new(chime:Chime, playCount:Int = 1) 
   {
      super();
      
      this.chime = chime;
	   this.playCount = playCount;
   }
}