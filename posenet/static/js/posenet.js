const videoWidth = 800;
const videoHeight = 600;
var net;
var minPartConfidence = 0.5;

/**
 * Loads a the camera to be used in the demo
 *
 */

var video = document.getElementById('video');

// Get access to the camera!
if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    // Not adding `{ audio: true }` since we only want video now
    navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
        //video.src = window.URL.createObjectURL(stream); //This is Old Version
        video.srcObject = stream;
        video.play();
    });
}
var canvas = document.getElementById('output');
var ctx = canvas.getContext('2d');

canvas.width = videoWidth;
canvas.height = videoHeight;
var i=0;


// Initializing the Net
const pinit = async() =>{
net = await posenet.load({
     inputResolution:{width:400, height:300},
     scale:0.69,
});
}


pinit();

var f=true;

// To display FPS
const putt=document.getElementById("putt");

// Wait for the camera to load and then start computing pose attributes
video.addEventListener('loadeddata', function() {
	
    
    //Main Computing Function
    const runPosenet = async() =>{
	if(f) detect(net);
	//FPS
        setInterval(() => {
            putt.innerHTML=i;
            i=0;
        }, 1000);
    }
    
    
    //Pose evaluation
    const detect = async(net) =>{
        try{
        f=false;
        const pose = await net.estimateSinglePose(video);
        console.log(i); i=i+1;
        drawCanvas(pose, video, videoWidth, videoHeight, canvas);
        f=true;} catch(err){};
        detect(net);
    }


    //To draw Image and Skeleton
    const drawCanvas = async(pose, video, videoWidth, videoHeight, canvas) => {
        ctx.drawImage(video, 0, 0, videoWidth, videoHeight);
        drawKeypoints(pose["keypoints"], minPartConfidence, ctx);
        drawSkeleton(pose["keypoints"], minPartConfidence, ctx);
	if(checkCircle(pose["keypoints"],coord)===false){
            let coordd=coord;
            coord=drawCircle(ctx,coordd);
        }
        else if(checkCircle(pose["keypoints"],coord)===true){
            coord=drawCircle(ctx);
        }
    }


    // Running the main function
    runPosenet();



}, false);



function setupFPS() {
  //To Complete
}
