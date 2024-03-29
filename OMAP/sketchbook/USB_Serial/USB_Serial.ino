// This line defines a "Uart" object to access the serial port
HardwareSerial Uart = HardwareSerial();

int ledPin = 9;    // LED connected to digital pin 9

int DutyCycle = 0;

void setup()
{
  Serial.begin(115200); // USB is always 12 Mbit/sec
  Uart.begin(115200);   // UART is set to 115200 kbps

}

void loop()
{
  if(Serial.available() > 0)
  {
 //   Serial.print("\nTest\n");  
    DutyCycle =Serial.read();  
    
 //   Serial.print(DutyCycle);
    DutyCycle = map(DutyCycle, 0, 100, 0, 255);     

  //  Serial.print(DutyCycle);
    analogWrite(ledPin, DutyCycle);         
    
    
  }
}
