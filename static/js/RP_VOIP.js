$(function(){
    // $("#hangupCall").hide();
    // $("#unregister").on('click', function(e){
    //   e.preventDefault();
    //   unregister();
    // });

    // $("#makeCall").on('click', function(e){
    //   e.preventDefault();
    //   e.stopPropagation();
    //   $(this).hide();
    //   $("#hangupCall").fadeIn();
    //   makeCall();
    // });

    // $("#hangupCall").on('click', function(e){
    //   e.preventDefault();
    //   e.stopPropagation();
    //   $(this).hide();
    //   $("#makeCall").fadeIn();
    //   hangupCall();
    // });

    // $("#acceptCall").on('click', function(e){
    //   e.preventDefault();
    //   acceptCall();
    // });


  });
    var sTransferNumber;
    var oRingTone, oRingbackTone;
    var oSipStack, oSipSessionRegister, oSipSessionCall, oSipSessionTransferCall;
    var videoRemote, videoLocal, audioRemote;
    //Step 2. Initialize sipml5 Engine in your web page 
    var readyCallback = function(e) {
        // function called when sipml is successfully initialised.
        createSipStack(); // calling this function to create sip stack(see below)
    };

    var errorCallback = function(e) {
        // function called when error occured during sipml initialisation.
    };
    SIPml.init(readyCallback, errorCallback);

    //Step 3. Create Sip Stack
    //Sip Stack is an object that must be created before making/receiving call and sms. Creating Sip stack is an asynchronous process, so you need to create an event listener function to get state change notification.

    var sipStack;

    function EventListener(e) {

         /*
        * e.type ;type of event listener
        * e.session ; current event session
        * e.getSipResponseCode() ; event response code
        * e.description ; event description
        */
        switch(e.type){
          case 'started':
          {
            // successfully started the stack.
            register();
            break;
          }
          case 'stopping': case 'stopped': case 'failed_to_start': case 'failed_to_stop':
          {
            var bFailure = (e.type == 'failed_to_start') || (e.type == 'failed_to_stop');
            stopRingbackTone();
            stopRingTone();
            var label = bFailure ? "Disconnected:" + e.description  : "Disconnected";
            $(".pretector-button-voip span").text("(" + label + ")");  
            // txtRegStatus.innerHTML = bFailure ? "<i>Disconnected: <b>" + e.description + "</b></i>" : "<i>Disconnected</i>";
            break;
          }
          case 'i_new_call': 
          {
            // when new incoming call comes.
            // incoming call Id ; e.newSession.getRemoteFriendlyName()

             if(callSession || incomingCallSession) {

                 e.newSession.hangup(); // hanging up new call when caller is in another outgoing call.

             } else {

                 e.newSession.getRemoteFriendlyName();
                incomingCallSession = e.newSession;
                incomingCallSession.setConfiguration({
                                        audio_remote: document.getElementById('audio-remote'),
                                        video_remote:document.getElementById('video-remote'),
                                        video_local:document.getElementById('audio-remote'),
                                        events_listener: { events: '*', listener: EventListener }
                                });
                startRingTone();
                var sRemoteNumber = (oSipSessionCall.getRemoteFriendlyName() || 'unknown');
                txtCallStatus.innerHTML = "<i>Incoming call from [<b>" + sRemoteNumber + "</b>]</i>";
                acceptCall(); // accepts call

             }
             break;
          }
          case 'i_ao_request':
              {
                  if (e.session == oSipSessionCall) {
                      var iSipResponseCode = e.getSipResponseCode();
                      if (iSipResponseCode == 180 || iSipResponseCode == 183) {
                          startRingbackTone();
                          txtCallStatus.innerHTML = '<i>Remote ringing...</i>';
                      }
                  }
                  break;
              }
          case 'm_early_media':
              {
                  if (e.session == oSipSessionCall) {
                      stopRingbackTone();
                      stopRingTone();
                      txtCallStatus.innerHTML = '<i>Early media started</i>';
                  }
                  break;
              }
          case 'connecting' : case 'connected' :
          {
             if(e.session == registerSession) {
              // txtRegStatus.innerHTML = "<i>" + e.description + "</i>";
              if(e.description == "Connected" || e.description == "In Call" || e.description == "Call terminated"){
                 $(".pretector-button-voip").prop('disabled', false);
              }else{
                $(".pretector-button-voip").prop('disabled', true);
              }
              $(".pretector-button-voip span").text("(" + e.description + ")");
                // registering session.
            } else if(e.session == callSession) {
              // txtRegStatus.innerHTML = "<i>" + e.description + "</i>";
              if(e.description == "Connected" || e.description == "In Call" || e.description == "Call terminated"){
                 $(".pretector-button-voip").prop('disabled', false);
              }else{
                $(".pretector-button-voip").prop('disabled', true);
              }
              $(".pretector-button-voip span").text("(" + e.description + ")");  
                // connecting outgoing call.
            } else if(e.session == incomingCallSession) {
              // txtRegStatus.innerHTML = "<i>" + e.description + "</i>";
              if(e.description == "Connected" || e.description == "In Call" || e.description == "Call terminated"){
                 $(".pretector-button-voip").prop('disabled', false);
              }else{
                $(".pretector-button-voip").prop('disabled', true);
              }
              $(".pretector-button-voip span").text("(" + e.description + ")");
                // connecting incoming call.
            }

            break;
          }
          case 'terminated':
          {
             /*
            * e.getSipResponseCode()=603 ; call declined without any answer
            * e.getSipResponseCode()=487 ; caller terminated the call
            * e.getSipResponseCode()=-1 ; call answered and hanguped by caller/callee 
            * e.getSipResponseCode()=200 ; user unregistered
            */

                 if(e.session == registerSession) {
                  if(e.description == "Connected" || e.description == "In Call" || e.description == "Call terminated"){
                     $(".pretector-button-voip").prop('disabled', false);
                  }else{
                    $(".pretector-button-voip").prop('disabled', true);
                  }
                    $(".pretector-button-voip span").text("(" + e.description + ")");  
                    // txtRegStatus.innerHTML = "<i>" + e.description + "</i>";
                    // client unregistered
                } else if(e.session == callSession) { 
                    callSession = null;
                    if(e.description == "Connected" || e.description == "In Call" || e.description == "Call terminated"){
                       $(".pretector-button-voip").prop('disabled', false);
                    }else{
                      $(".pretector-button-voip").prop('disabled', true);
                    }
                    $(".pretector-button-voip span").text("(" + e.description + ")");  
                    // txtRegStatus.innerHTML = "<i>" + e.description + "</i>";
                    //outgoing call terminated.
                } else if(e.session == incomingCallSession) { 
                    incomingCallSession = null;
                    if(e.description == "Connected" || e.description == "In Call" || e.description == "Call terminated"){
                       $(".pretector-button-voip").prop('disabled', false);
                    }else{
                      $(".pretector-button-voip").prop('disabled', true);
                    }
                    $(".pretector-button-voip span").text("(" + e.description + ")");  
                    // txtRegStatus.innerHTML = "<i>" + e.description + "</i>";
                    // incoming call terminated
                }
                break;
          }
        }
      }

    function createSipStack() {
        sipStack = new SIPml.Stack({
                                realm: '140.138.77.152', // mandatory domain name
                                impi: '6000', // mandatory authorisation name
                                impu: 'sip:6000@140.138.77.152', // mandatory sip uri
                                password: '6000', //optional
                                display_name: '6000', // optional
                                websocket_proxy_url: 'ws://140.138.77.152:8088/ws', // optional
                                // outbound_proxy_url: 'udp://example.com:5060', // optional
                                ice_servers:"[{ url: 'stun:stun.l.google.com:19302'}]",
                                enable_rtcweb_breaker: true, // optional
                                enable_early_ims:false,
                                enable_media_stream_cache:true,
                                events_listener: { events: '*', listener: EventListener } /* optional , '*' means all events */
                        });

             sipStack.start(); // starting sip stack
    }
    //Step 4. Register
    //Register is used to register the sip to server. It is not mandatory to register to receive call/sma.
    var registerSession;

    function register() { // register function
        registerSession = sipStack.newSession('register', {
                                    expires: 300, // expire time, optional
                                    events_listener: { events: '*', listener: EventListener } /* optional, '*' means all events. */
                                    });
        registerSession.register(); // registering session.
    }

    //Step 5. Make Outgoing call.
    var callSession;

    function makeCall() {
        callSession = sipStack.newSession('call-audio', {
        /* audio and video will not be played if you didnt give values to audio_remote,video_remote and for video_local. */
                                        audio_remote: document.getElementById('video-remote'),
                                        video_remote:document.getElementById('video-remote'),
                                        video_local:document.getElementById('audio-remote'),
                                        events_listener: { events: '*', listener: EventListener }
                            });
         callSession.call("6002");
    }


    //Step 6. Receiving incoming call :
    //"i_new_call" event is generated when a new incoming call arrives. This event handler should be added when sip stack is created.

    

    function acceptCall() {       // accept incoming call.

        incomingCallSession.accept();
    }


    //Step 7. Hangup or Reject a call

    function hangupCall() { // call this function to hangup /reject a call.
        if(callSession) {
            callSession.hangup(); // hangups outgoing call.
        } else if(incomingCallSession) {
            incomingCallSession.reject(); // rejects incoming call.
        }
        unregister();
        register();
    }

    //Step 8. Unregistering Client.

    function unregister() { // call this function to unregister this function
        registerSession.unregister();
    }


    function startRingTone() {
        try { ringtone.play(); }
        catch (e) { }
    }

    function stopRingTone() {
        try { ringtone.pause(); }
        catch (e) { }
    }

    function startRingbackTone() {
        try { ringbacktone.play(); }
        catch (e) { }
    }

    function stopRingbackTone() {
        try { ringbacktone.pause(); }
        catch (e) { }
    }