package nfuzion.message.leap.type;

/**
 * ...
 * @author Christopher George
 */
enum Gesture
{
   // One finger gestures
   oneFingerSwipeLeft;
   oneFingerSwipeRight;
   oneFingerSwipeUp;
   oneFingerSwipeDown;
   
   // Two finger gestures
   twoFingerSwipeLeft;
   twofingerSwipeRight;
   twoFingerSwipeUp;
   twoFingerSwipeDown;
   
   // Gestures for dismissing and recalling/beckoning the right hand screen and turn-by-turn info.
   dismiss;
   beckon;
}