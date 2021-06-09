
//Getting song video 
var vid = document.getElementById("VideoSong"); 

function playVid() { 
vid.currentTime = 0
  vid.play(); 
} 

function pauseVid() { 
  vid.pause(); 
} 



let constraintObj = { 
    audio: true, 
    video: { 
        facingMode: "user", 
       
    }
}; 

//handle older browsers that might implement getUserMedia in some way
if (navigator.mediaDevices === undefined) {
    navigator.mediaDevices = {};
    navigator.mediaDevices.getUserMedia = function(constraintObj) {
        let getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
        if (!getUserMedia) {
            return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
        }
        return new Promise(function(resolve, reject) {
            getUserMedia.call(navigator, constraintObj, resolve, reject);
        });
    }
}else{
    navigator.mediaDevices.enumerateDevices()
    .then(devices => {
        devices.forEach(device=>{
            console.log(device.kind.toUpperCase(), device.label);
            //, device.deviceId
        })
    })
    .catch(err=>{
        console.log(err.name, err.message);
    })
}

navigator.mediaDevices.getUserMedia(constraintObj)
.then(function(mediaStreamObj) {
    //connect media stream til det første video element
    let video = document.querySelector('video');
    if ("srcObject" in video) {
        video.srcObject = mediaStreamObj;
    } else {
        //old version browser
        video.src = window.URL.createObjectURL(mediaStreamObj);
    }
    
    video.onloadedmetadata = function(ev) {
        //Vis i video element hvad der bliver vist fra webcam
        video.play();
    };
    
    //Opsætter listeners for at gemme video/audio
    let start = document.getElementById('btnStart');
    let stop = document.getElementById('btnStop');
    let vidSave = document.getElementById('vid2');
    let mediaRecorder = new MediaRecorder(mediaStreamObj);
    let chunks = [];
  

    start.addEventListener('click', (e)=>{
        mediaRecorder.start();
        console.log(mediaRecorder.state);
    })
    stop.addEventListener('click', (e)=>{
        mediaRecorder.stop();
        console.log(mediaRecorder.state);
    });
    mediaRecorder.ondataavailable = function(ev) {
        chunks.push(ev.data);
    }
    mediaRecorder.onstop = (e)=>{
        let blob = new Blob(chunks, { 'type' : 'video/mp4;' });
        chunks = [];
        let videoURL = window.URL.createObjectURL(blob);
        vidSave.src = videoURL;
    }
   
})


.catch(function(err) { 
    console.log(err.name, err.message); 
});

