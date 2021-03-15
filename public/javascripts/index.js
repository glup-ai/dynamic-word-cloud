const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");

let audio;

const socket = io();

socket.on("connect", () => {
  console.log(socket.id);
});

socket.on('results', function (data) {
    console.log(data);
});

startButton.onclick = function () {
  startButton.disabled = true;

  navigator.getUserMedia(
    {
      audio: true,
    },
    function (stream) {
      audio = RecordRTC(stream, {
        type: "audio",
        mimeType: "audio/webm",
        sampleRate: 44100,
        desiredSampRate: 16000,
        recorderType: StereoAudioRecorder,
        numberOfAudioChannels: 1,
        timeSlice: 4000,
        ondataavailable: function(blob) {
            var stream = ss.createStream();
            ss(socket).emit('stream', stream, {
                name: 'stream.wav',
                size: blob.size
            });
            ss.createBlobReadStream(blob).pipe(stream);
        }
      });

      recordAudio.startRecording();
      stopButton.disabled = false;
    },
    function (error) {
      console.error(JSON.stringify(error));
    }
  );
};

stopButton.onclick = function() {
    startButton.disabled = false;
    stopButton.disabled = true;

};