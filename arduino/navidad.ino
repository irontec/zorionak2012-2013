#include "SPI.h"
#include "avr/pgmspace.h"
#include "Ethernet.h"
#include "WebServer.h"
#include <stdlib.h>

template<class T>
inline Print &operator <<(Print &obj, T arg)
{ obj.print(arg); return obj; }

//Pin connected to ST_CP of 74HC595
const int latchPin = 7;
//Pin connected to SH_CP of 74HC595
const int clockPin = 9;
////Pin connected to DS of 74HC595
const int dataPin = 8;

byte bitsToSend1 = 0;
byte bitsToSend0 = 0;
byte bitsToSend2 = 0;
byte bitsToSend3 = 0;

static uint8_t mac[] = { 0x90, 0xA2, 0xDA, 0x00, 0x24, 0x4C };

static uint8_t ip[] = { 10, 10, 0, 143 };

#define PREFIX ""
#define NAMELEN 3
#define VALUELEN 2

WebServer webserver(PREFIX, 80);

void processCmd(WebServer &server, WebServer::ConnectionType type, char *url_tail, bool tail_complete)
{
  
    if (type == WebServer::HEAD) {
      server.httpSuccess();
      return;
    }
    
    server.httpSuccess("application/json");


    if (type == WebServer::POST) {
    
    URLPARAM_RESULT rc;
    char name[NAMELEN];
    int  name_len;
    char value[VALUELEN];
    int value_len;
    int tempPin;
    int tempState;

    if (strlen(url_tail)) {
      while (strlen(url_tail))
        rc = server.nextURLparam(&url_tail, name, NAMELEN, value, VALUELEN);
    }
  
  

      while (server.readPOSTparam(name, NAMELEN, value, VALUELEN))
      {

        tempPin = (int)name[1] - 48;
        
        if ((int)value[0] == 49) { // character '1' 
          tempState = 1;
        } else {
          tempState = 0;
        }
        
         if (name[0] == 'a') {
          bitWrite(bitsToSend0, tempPin, tempState);
        } else if (name[0] == 'b') {
           bitWrite(bitsToSend1, tempPin, tempState);
        } else if (name[0] == 'c') {
           bitWrite(bitsToSend2, tempPin, tempState);          
        } else if  (name[0] == 'd') {
           bitWrite(bitsToSend3, tempPin, tempState);
        }    
      }

     updateLeds();
  }


 server << "[{" << bitsToSend0 << ", " << bitsToSend1 << ", " << bitsToSend2 << ", " << bitsToSend3 << "}]";


}
  
void setup() {
  pinMode(latchPin, OUTPUT);
  pinMode(dataPin, OUTPUT);  
  pinMode(clockPin, OUTPUT);
  

  // start the Ethernet connection and the server:
  Ethernet.begin(mac, ip);
  webserver.begin();
  webserver.setDefaultCommand(&processCmd);

  updateLeds();
}

void loop() {
 
  webserver.processConnection();
}

// the heart of the program
void updateLeds() {
  
  digitalWrite(latchPin, LOW);

  shiftOut(dataPin, clockPin, MSBFIRST, bitsToSend3); // nº3 << Ultimo
  shiftOut(dataPin, clockPin, MSBFIRST, bitsToSend2); // nº2
  shiftOut(dataPin, clockPin, MSBFIRST, bitsToSend1); // nº1
  shiftOut(dataPin, clockPin, MSBFIRST, bitsToSend0); // nº0

  digitalWrite(latchPin, HIGH);
  delay(100);
}



