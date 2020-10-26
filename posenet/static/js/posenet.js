var videoWidth = 800;
var videoHeight = 600;
const startButtonX = 0.05;
const startButtonY = 0.75;
const circleRadius = 0.05;
const exitButtonX = 1-0.05;
const exitButtonY = 0.75;
const handGameX = 0.25;
const handGameY = 0.25;
const squatGameX = 0.75;
const squatGameY = 0.25;
let coord;
const minPartConfidence = 0.5;
var net;

var pp=JSON.parse(pose_list);

let poseList=pp["pose_lists"];
let poseListLength=pp["pose_lists"].length;

/**
 * Loads a the camera to be used in the demo
 *
 */
var video = document.getElementById('video');
video.width = videoWidth;
video.height = videoHeight;

// Get access to the camera!
if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    // Not adding `{ audio: true }` since we only want video now
    navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
        //video.src = window.URL.createObjectURL(stream);
        video.srcObject = stream;
        video.play();
    });
}

var canvas = document.getElementById('output');
canvas.width = videoWidth;
canvas.height = videoHeight;
var ctx = canvas.getContext('2d');

var i=0; //FPS Purpose
var startEnable = true;
var startup = false;
var hand = false;
var multi = false;
var ii=0;


// Initializing the Net
const pinit = async() =>{
net = await posenet.load({
            inputResolution:{width:400, height:300},
            scale:0.69,
});
}


pinit();

var f=true;

const putt=document.getElementById("putt");
video.addEventListener('loadeddata', function() {

    videoWidth = this.videoWidth;
    videoHeight = this.videoHeight;

    video.width = videoWidth;
    video.height = videoHeight;

    canvas.width = videoWidth;
    canvas.height = videoHeight;


    const runPosenet = async() =>{
        if(f) detect(net);
        //FPS
        setInterval(() => {
            putt.innerHTML=i;
            i=0;
        }, 1000);
    }


    drawCircle(ctx, [startButtonX,startButtonY], circleRadius, 'green', "START");

    const detect = async(net) =>{
        try{
        f=false;
        const pose = await net.estimateSinglePose(video);
        console.log(pose);

        console.log(i); i=i+1;
        drawCanvas(pose, video, videoWidth, videoHeight, canvas);
        f=true;} catch(err){console.log("Net not loaded yet");};
        detect(net);
    }


    const drawCanvas = async(pose, video, videoWidth, videoHeight, canvas) => {
        ii=ii+1;
        ii=ii%poseListLength;
        ctx.drawImage(video, 0, 0, videoWidth, videoHeight);
        drawKeypoints(pose["keypoints"], minPartConfidence, ctx);
        //drawSkeleton(pose["keypoints"], minPartConfidence, ctx);
        if(multi){
            drawKeypoints(poseList[ii]["keypoints"], minPartConfidence, ctx, (videoWidth)/800, 'mediumblue');
            drawSkeleton(poseList[ii]["keypoints"], minPartConfidence, ctx, (videoWidth)/800, 'mediumblue');
        }
        if(startEnable) {
            if(checkCircle(pose["keypoints"],[startButtonX,startButtonY],[9,10])===false){
                drawCircle(ctx, [startButtonX,startButtonY], circleRadius, 'green', "START");
            }
            else if(checkCircle(pose["keypoints"],[startButtonX,startButtonY],[9,10])===true){
                startEnable = false;
                startup = true;
                drawCircle(ctx, [handGameX,handGameY], circleRadius, 'dodgerblue', "HAND");
                drawCircle(ctx, [squatGameX,squatGameY], circleRadius, 'dodgerblue', "SQUAT");
                //coord = drawCircle(ctx);
            }
        }
        if(startup){
            if(checkCircle(pose["keypoints"],[handGameX,handGameY],[9,10])===false){
                drawCircle(ctx, [handGameX,handGameY], circleRadius, 'dodgerblue', "HAND");
            }
            else if(checkCircle(pose["keypoints"],[handGameX,handGameY],[9,10])===true){
                startup = false;
                hand = true;
                multi = false;
                coord = drawCircle(ctx);
            }
            if(checkCircle(pose["keypoints"],[squatGameX,squatGameY],[9,10])===false){
                drawCircle(ctx, [squatGameX,squatGameY], circleRadius, 'dodgerblue', "SQUAT");
            }
            else if(checkCircle(pose["keypoints"],[squatGameX,squatGameY],[9,10])===true){
                startEnable = false;
                startup = false;
                multi = true;
                hans = true;
            }
        }
        if(hand){
            if(checkCircle(pose["keypoints"],coord,[9,10])===false){
                drawCircle(ctx, coord, circleRadius);
            }
            else if(checkCircle(pose["keypoints"],coord,[9,10])===true){
                coord = drawCircle(ctx);
            }
        }
        if(!startEnable) {
            if(checkCircle(pose["keypoints"],[exitButtonX,exitButtonY],[9,10])===false){
                drawCircle(ctx, [exitButtonX,exitButtonY], circleRadius, 'green', "EXIT");
            }
            else if(checkCircle(pose["keypoints"],[exitButtonX,exitButtonY],[9,10])===true){
                startEnable = true;
                hand = false;
                multi = false;
                startup = false;
            }
        }
    }


    runPosenet();




}, false);
