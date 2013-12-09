package nfuzion.message.chime;
import nfuzion.message.generic.templates.Let;
import nfuzion.message.chime.type.Chime;

/**
 * ...
 * @author Robert Sturtz
 */

 // This message may not be needed, however it can provide positive feedback to HMI
 
 class LetChime extends Let
{
   public var chime:Chime;
   public var playCount:Int;
   
   public function new(chime:Chime, playCount:Int = 0) 
   {
      super();
      
      this.chime = chime;
      this.playCount = playCount;
   }
}