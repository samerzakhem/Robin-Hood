package nfuzion.message.tts;
import nfuzion.message.generic.templates.Set;
import nfuzion.message.generic.templates.SetString;
import nfuzion.message.tts.type.CacheTypes;

/*
 *
 * @author Steve Mobley
 * 
 */

 class SetClearCache extends SetString
{
   public var cache:CacheTypes;
   
   public function new(cache:CacheTypes, value:String = null)
   {
      super(value);
      
      this.cache = cache;
   }
   
}