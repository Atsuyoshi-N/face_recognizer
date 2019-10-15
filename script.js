const video = document.getElementById('video');

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromDisk('./models'),
  faceapi.nets.faceLandmark68Net.loadFromDisk('./models'),
  faceapi.nets.faceRecognitionNet.loadFromDisk('./models'),
  faceapi.nets.faceExpressionNet.loadFromDisk('./models'),
]).then(startVideo);

function startVideo() {
  navigator.getUserMedia(
    {
      video: {},
    },
    stream => (video.srcObject = stream),
    err => console.error(err),
  );
}

video.addEventListener('play', () => {
  const canvas = faceapi.createCanvasFromMedia(video);
  document.body.append(canvas);
  const displaySize = {width: video.width, height: video.height};
  faceapi.matchDimensions(canvas, displaySize);
  setInterval(async () => {
    const detections = await faceapi
      .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions()
      .withAgeAndGender();
    console.log(detections);
    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    faceapi.draw.drawDetections(canvas, resizedDetections);
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
  }, 100);
});
