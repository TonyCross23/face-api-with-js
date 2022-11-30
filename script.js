Promise.all([
     faceapi.nets.tinyFaceDetector.loadFromUri('/face-api/models'),
     faceapi.nets.faceExpressionNet.loadFromUri('/face-api/models'),
     faceapi.nets.faceLandmark68Net.loadFromUri('/face-api/models'),
     faceapi.nets.ageGenderNet.loadFromUri('/face-api/models'),
]).then(initVideo);

function initVideo(){
    navigator.mediaDevices.getUserMedia({
            video: {
                width:820, 
                height:640
            }
    })
    .then((stream)=>{
            video.srcObject = stream;
    })
    .catch((error) => {
        console.log(error)
    });
}


video.addEventListener('play', function(){

    const canvas = faceapi.createCanvasFromMedia(video);
    document.body.append(canvas);

    const displaySize =  {
                                        width : video.width , 
                                        height : video.height
                                    };

    setInterval(async function() {
                    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
                    .withFaceLandmarks().withFaceExpressions().withAgeAndGender();
                    const resizedResults = faceapi.resizeResults(detections, displaySize)
                    canvas.getContext('2d').clearRect(0,0,canvas.width,canvas.height);
                    faceapi.draw.drawDetections(canvas, resizedResults)
                    faceapi.draw.drawFaceLandmarks(canvas, resizedResults)
                    const minProbability = 0.05
                    faceapi.draw.drawFaceExpressions(canvas, resizedResults, minProbability)
                },100);

});