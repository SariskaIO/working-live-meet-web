let canvas;
let context;
let codec_string = "avc1.42001E";
let underflow1 = true;
let underflow2 = true;
let ready_frames1 = [];
let ready_frames2 = [];
let timeout;
let shouldCancel = false;

function renderMultipleTracks(canvas, reader1, reader2, user1, user2) {
  readChunk();
  function readChunk() {
      let promises  = [];
      if (user1) {
        promises.push( reader1 ? reader1.read() : new Promise((resolve, reject) =>{ reject(1)}));
      }

      if (user2) { 
        promises.push( reader2 ? reader2.read() : new Promise((resolve, reject) =>{ reject(1)}));
      }

      Promise.allSettled(promises).then((values) => {
        const ctx = canvas.getContext("2d", { alpha: true });
        ctx.strokeStyle = "red"; // Border color
        ctx.lineWidth = 5;       // Border width
        ctx.strokeRect(0, 0, canvas.width, canvas.height);
        render(ctx, values[0]?.value?.value, values[1]?.value?.value, values.length, user1, user2);
        if (!values[0]?.value?.value && !values[1]?.value?.value) {
          timeout = setTimeout( ()=>readChunk() ,16);
        } else {
          clearTimeout(timeout);
          readChunk();
        }
      }).then(function(arrayOfValuesOrErrors) {
        // handling of my array containing values and/or errors. 
      })
      .catch(function(err) {
        console.log("errnjjjjjjjjjjjjj", err.message); // some coding error in handling happened
        readChunk();
      });
  }
}

self.onmessage = async function(event) {
  if (event.data.canvas) {
    canvas = event.data.canvas;
  }  else {
    let user1 = event.data.user1;
    let user2 = event.data.user2;
    let reader1  =  event.data.frame_source1 ? event.data.frame_source1.getReader() : undefined;
    let reader2 = event.data.frame_source2 ? event.data.frame_source2.getReader(): undefined;
    renderMultipleTracks(canvas, reader1, reader2, user1, user2);  
  }
}


function render(context, frame1, frame2, participantCount, user1, user2) {  
  let isBothUsersMuted = false;
  if (participantCount === 2) {
    context.canvas.width  = 480;
    context.canvas.height = 540;  
    
    if (frame1 && frame2) {
        context.clearRect(0, 0, 480, 540);
        context.scale(-1, 1);
        if (frame1) {
          underflow1 = false;  
          context.drawImage( frame1, 0, 0, frame1.codedWidth, frame1.codedHeight, -480, 0, 480, 270);
          frame1.close();   
        }

        if (frame2) {
          underflow2 = false;  
          context.drawImage( frame2, 0, 0, frame2.codedWidth, frame2.codedHeight, -480, 270, 480, 270);
          frame2.close();    
        }       
    } else if (frame1 && !frame2) { 
      if (frame1) {
        context.scale(-1, 1);
        underflow1 = false;  
        context.drawImage( frame1, 0, 0, frame1.codedWidth, frame1.codedHeight, -480, 0, 480, 270);
        frame1.close();   
      }

      context.save();
      drawNameWithMuteState(user2.name, user2.color, context, 480, 390, true);
    } else if (!frame1 && frame2) {    
      context.save();
      drawNameWithMuteState(user1.name, user1.color, context, 480,  90);
      if (frame2) {
        underflow2 = false;  
        context.scale(-1, 1);
        context.drawImage( frame2, 0, 0, frame2.codedWidth, frame2.codedHeight, -480, 270, 480, 270);
        frame2.close();    
      }   
    } else {
      context.save();
      isBothUsersMuted = true;
      let isBottom = true;
      drawNameWithMuteState(user1.name, user1.color, context, 480,  110, true, isBothUsersMuted);
      drawNameWithMuteState(user2.name, user2.color, context, 480, 380, true, isBothUsersMuted, isBottom);
    }
  } else if (participantCount === 1)  {
    context.canvas.width  = 480;
    context.canvas.height = 270;
    if (frame1) {
        underflow1 = false;  
        context.scale(-1, 1);
        context.drawImage( frame1, 0, 0, frame1.codedWidth, frame1.codedHeight, -480, 0, 480, 270);
        frame1.close();   
    } else {
      context.save();
      drawNameWithMuteState(user1.name, user1.color, context, 480, 110);
    }
  }
}

async function drawNameWithMuteState(name, color, context, centerX, centerY, isPostDraw, isBothUsersMuted, isBottom) { 
  if(!isBothUsersMuted){
    context.scale(-1, 1);
  }  
  let newCenterX = isPostDraw ?  centerX - 240 : centerX - 480 - 240;
  var radius = 40;
  context.fillStyle = color;
  context.arc(newCenterX , centerY, radius, 0, 2 * Math.PI, false);
  context.fill();
  if(!isPostDraw){
    // Move to the text position and apply a local transformation
    context.translate(newCenterX, centerY); // Move the origin to the text position
    context.scale(-1, 1);    // Flip horizontally
    context.translate(-newCenterX , -centerY); // Restore the origin back
  }

  context.beginPath();
  context.font = "bold 40px Noto Sans Korean";
  context.fillStyle = "white";
  context.textAlign = "center";
  context.fillText(name && name[0]?.toUpperCase(), newCenterX, centerY + 15 );

  context.beginPath();
  context.letterSpacing = "2px";
  context.font = "30px Noto Sans Korean";
 // context.fillStyle = "white";
  context.textAlign = "center";
  const gradient = context.createLinearGradient(0, 0, canvas.width, 0);
  gradient.addColorStop(0, '#718EFF');
  gradient.addColorStop(1, "#7D73FF");
  context.shadowColor = "rgba(0, 0, 0, 0.5)";
  context.shadowBlur = 5;
  context.shadowOffsetX = 3;
  context.shadowOffsetY = 3;
  context.fillStyle = gradient;
  context.fillText(name, newCenterX, centerY + 85 );
  context.direction = 'rtl'

    // Start drawing
if(isBottom){
    context.beginPath();          // Start a new path
    context.moveTo(10, 270);       // Move to starting point (x1, y1)
    context.lineTo(470, 270);     // Draw a line to ending point (x2, y2)
    context.strokeStyle = "#aaa"; // Set line color
    context.lineWidth = 1;        // Set line width
    context.stroke();    
}

  context.restore();
}