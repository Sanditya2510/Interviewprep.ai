<!DOCTYPE html>
<html>
<head>
  <script src="https://code.jquery.com/jquery-3.1.0.min.js"></script>
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js">
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap-theme.min.css">
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css">
  <script src="https://download.affectiva.com/js/3.2.1/affdex.js"></script>
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
  
</head>
<body>
  <div class="container-fluid">
    <div class="row">
      <div class="col-md-8" id="affdex_elements" style="width:680px;height:480px;"></div>
      <div class="col-md-4">
        <div style="height:25em;">
          <strong>EMOTION TRACKING RESULTS</strong>
          <div id="results" style="word-wrap:break-word;"></div>
        </div>
        <div>
          <strong>DETECTOR LOG MSGS</strong>
        </div>
        <div id="logs"></div>
      </div>
    </div>
    <div>
      <button id="start" onclick="onStart()">Start</button>
      <button id="stop" onclick="onStop()">Stop</button>
      <button id="reset" onclick="onReset()">Reset</button>
      <h3>Affectiva JS SDK CameraDetector to track different emotions.</h3>
      <p>
        <strong>Instructions</strong>
        </br>
        Press the start button to start the detector.
        <br/> When a face is detected, the probabilities of the different emotions are written to the DOM.
        <br/> Press the stop button to end the detector.
      </p>
    </div>
  </div>
  <script type="text/javascript">
          // SDK Needs to create video and canvas nodes in the DOM in order to function
      // Here we are adding those nodes a predefined div.
      var divRoot = $("#affdex_elements")[0];
      var width = 640;
      var height = 480;
      var faceMode = affdex.FaceDetectorMode.LARGE_FACES;
      //Construct a CameraDetector and specify the image width / height and face detector mode.
      var detector = new affdex.CameraDetector(divRoot, width, height, faceMode);

      //Enable detection of all Expressions, Emotions and Emojis classifiers.
      detector.detectAllEmotions();
      detector.detectAllExpressions();
      detector.detectAllEmojis();
      detector.detectAllAppearance();

      //Add a callback to notify when the detector is initialized and ready for runing.
      detector.addEventListener("onInitializeSuccess", function() {
        log('#logs', "The detector reports initialized");
        //Display canvas instead of video feed because we want to draw the feature points on it
        $("#face_video_canvas").css("display", "block");
        $("#face_video").css("display", "none");
      });

      function log(node_name, msg) {
        $(node_name).append("<span>" + msg + "</span><br />")
      }

      //function executes when Start button is pushed.
      function onStart() {
        if (detector && !detector.isRunning) {
          $("#logs").html("");
          detector.start();
        }
        log('#logs', "Clicked the start button");
      }

      //function executes when the Stop button is pushed.
      function onStop() {
        log('#logs', "Clicked the stop button");
        if (detector && detector.isRunning) {
          detector.removeEventListener();
          detector.stop();
        }
      };

      //function executes when the Reset button is pushed.
      function onReset() {
        log('#logs', "Clicked the reset button");
        if (detector && detector.isRunning) {
          detector.reset();

          $('#results').html("");
        }
      };

      //Add a callback to notify when camera access is allowed
      detector.addEventListener("onWebcamConnectSuccess", function() {
        log('#logs', "Webcam access allowed");
      });

      //Add a callback to notify when camera access is denied
      detector.addEventListener("onWebcamConnectFailure", function() {
        log('#logs', "webcam denied");
        console.log("Webcam access denied");
      });

      //Add a callback to notify when detector is stopped
      detector.addEventListener("onStopSuccess", function() {
        log('#logs', "The detector reports stopped");
        $("#results").html("");
      });

      //Add a callback to receive the results from processing an image.
      //The faces object contains the list of the faces detected in an image.
      //Faces object contains probabilities for all the different expressions, emotions and appearance metrics
      detector.addEventListener("onImageResultsSuccess", function(faces, image, timestamp) {
        $('#results').html("");
        log('#results', "Timestamp: " + timestamp.toFixed(2));
        log('#results', "Number of faces found: " + faces.length);
        if (faces.length > 0) {
          log('#results', "Appearance: " + JSON.stringify(faces[0].appearance));
          log('#results', "Emotions: " + JSON.stringify(faces[0].emotions, function(key, val) {
            return val.toFixed ? Number(val.toFixed(0)) : val;
          }));
          log('#results', "Expressions: " + JSON.stringify(faces[0].expressions, function(key, val) {
            return val.toFixed ? Number(val.toFixed(0)) : val;
          }));
          log('#results', "Emoji: " + faces[0].emojis.dominantEmoji);
          if($('#face_video_canvas')[0] != null)
            drawFeaturePoints(image, faces[0].featurePoints);
        }
      });

      //Draw the detected facial feature points on the image
      function drawFeaturePoints(img, featurePoints) {
        var contxt = $('#face_video_canvas')[0].getContext('2d');

        var hRatio = contxt.canvas.width / img.width;
        var vRatio = contxt.canvas.height / img.height;
        var ratio = Math.min(hRatio, vRatio);

        contxt.strokeStyle = "#FFFFFF";
        for (var id in featurePoints) {
          contxt.beginPath();
          contxt.arc(featurePoints[id].x,
            featurePoints[id].y, 2, 0, 2 * Math.PI);
          contxt.stroke();

        }
      }

  </script>
</body>

</html>