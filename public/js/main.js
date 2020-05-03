/* global $, io */

(() => {
  // Initialize socket instance
  const socket = io();

  // Add event to the event list
  const addEvent = ({ date, message, status }) => {
    $("#events").prepend(
      `<li class="event event-${status}"><div class="event-text"><h3>${message}</h3><small>${date.toLocaleString()}</small></div></li>`
    );
  };

  // Socket.IO connect event
  socket.on("connect", () => {
    addEvent({ date: new Date(), message: "Socket connected to server", status: "success" });
  });

  // Socket.IO info event
  socket.on("info", (data) => {
    $("#start-feeder-btn").attr("disabled", !data.isFeedingPossible);
    $("#start-speech-recording-btn").attr("disabled", !data.isRecordingPossible);
  });

  // Socket.IO image event
  socket.on("image", (data) => {
    $("#highlighted-image-placeholder").hide();
    $("#img-container > img").remove();
    $("#img-container").prepend(
      `<img id="highlighted-image" class="img-fluid" src="data:image/jpeg;base64,${data.cameraImage}" alt="${data.date}">`
    );
  });

  // Socket.IO feedingStarted event
  socket.on("feedingStarted", (data) => {
    const updatedDate = new Date(data.date);

    addEvent({ ...data, ...{ date: updatedDate } });
  });

  // Socket.IO feedingStopped event
  socket.on("feedingStopped", (data) => {
    const updatedDate = new Date(data.date);

    addEvent({ ...data, ...{ date: updatedDate } });
  });

  // Socket.IO speechRecordingStarted event
  socket.on("speechRecordingStarted", (data) => {
    const updatedDate = new Date(data.date);

    addEvent({ ...data, ...{ date: updatedDate } });
  });

  // Socket.IO speechRecordingStopped event
  socket.on("speechRecordingStopped", (data) => {
    const updatedDate = new Date(data.date);

    addEvent({ ...data, ...{ date: updatedDate } });
  });

  // Handle click on #start-feeder-btn
  $("#start-feeder-btn").click(() => {
    socket.emit("startFeeding", {});
  });

  // Handle click on #start-speech-recording-btn
  $("#start-speech-recording-btn").click(() => {
    socket.emit("startSpeechRecording", {});
  });
})();
