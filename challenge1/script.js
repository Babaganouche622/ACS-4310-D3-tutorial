const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const playButton = document.getElementById('button-play');

// Canvas variables
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const radius = canvas.width / 5;

// Bass drum colour content
const colourArray = ["#300350", "#94167F", "#E93479", "#F9AC53", "#F62E97", "#153CB4"];
const bassDrumFrequencyRange = {
  min: 0,  // Adjust the range based on your audio data
  max: 5
};
let isBassDrumKick = false;
let drumSpeed = 0;
let colour;
let currentIndex = 0;

// Blobs variables, bot being used right now
let startBlobs = true;
let blobs = [];

// Audio variables
let analyser;
let frequencyArray;

function startAudio() {
  const audio = new Audio()
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();

  // audio.src = 'mohgLordOfBlood.wav'
  audio.src = 'futureGirlfriend.wav'

  // --------------------------------------------------------
  // Create an audio analyser
  analyser = audioContext.createAnalyser();
  // Create an audio source
  const source = audioContext.createMediaElementSource(audio);
  // Connect the source to the analyser
  source.connect(analyser);
  // Connect the analyser to the audio context
  analyser.connect(audioContext.destination);
  // Get an array of audio data from the analyser
  frequencyArray = new Uint8Array(analyser.frequencyBinCount);
  // --------------------------------------------------------
  // Play the audio
  audio.play();

  render();
}

function render() {  
  // called every frame or 1/60 of a second
  ctx.clearRect(0, 0, 400, 400);
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);  
  
  
  const bars = 200;
  const step = Math.PI * 2 / bars;
  
  analyser.getByteFrequencyData(frequencyArray);

  frequencyArray.forEach((f, i) => {
    const barLength = frequencyArray[i] * 0.5;
    const x1 = (Math.cos(step * i) * radius) + centerX;
    const y1 = (Math.sin(step * i) * radius) + centerY;
    const x2 = (Math.cos(step * i) * (radius + barLength)) + centerX;
    const y2 = (Math.sin(step * i) * (radius + barLength)) + centerY;
    
    ctx.strokeStyle = `hsl(${i % 360}, 100%, 50%)`;    
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  })
  
  // if (startBlobs) {
  //   generateBlob(20);
  //   startBlobs = false;
  // };

  colourCentre(frequencyArray);
  // updateBlobs();
  requestAnimationFrame(render);
}

function generateBlob(num) {
  for (let i = 0; i < num; i++) {
    frequencySelection = Math.floor(Math.random() * frequencyArray.length);
    const blobSize = mapRange(frequencySelection, 0, frequencyArray.length, 10, 100);
    // Map frequency to blob speed
    const blobSpeed = mapRange(frequencySelection, 0, frequencyArray.length, 1, 10);
    // Map frequency to blob x position
    const blobX = Math.random() * canvas.width;

    blobs.push({ x: blobX, y: -blobSize, size: blobSize / 2, speed: blobSpeed / 30 });
  }
}

function colourCentre(frequencyArray) {
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
  // const hue = Math.floor(Math.random() * colourArray.length);
  const hue = currentIndex % colourArray.length;
   

  const bassDrumRange = frequencyArray.slice(
    Math.floor(bassDrumFrequencyRange.min / (analyser.frequencyBinCount / frequencyArray.length)),
    Math.floor(bassDrumFrequencyRange.max / (analyser.frequencyBinCount / frequencyArray.length))
  );

  const bassDrumThreshold = 250;  // Adjust the threshold based on your audio data
  const isKickDetected = bassDrumRange.some(frequency => frequency > bassDrumThreshold);

  if (isKickDetected) {
    isBassDrumKick = true;
  }

  if (isBassDrumKick) {
    if (drumSpeed === 0) {
        // Use the current index instead of generating a random index
        colour = colourArray[hue];
        ctx.fillStyle = colour;
        ctx.fill();
        drumSpeed += 1;
        isBassDrumKick = false;
      } else {
        ctx.fillStyle = colour;
        ctx.fill();
        drumSpeed += 1;
        isBassDrumKick = false;
      }
    }
    if (drumSpeed > 50) {
      currentIndex = (currentIndex + 1) % colourArray.length; // Increment and reset the index
      drumSpeed = 0;
  }
}

function updateBlobs() {
  const totalBlobs = blobs.length;
  blobs = blobs.filter(blob => blob.y <= canvas.height);
  const newTotalBlobs = blobs.length;
  const numBlobs = totalBlobs - newTotalBlobs;
  generateBlob(numBlobs);
    blobs.forEach(blob => {
      blob.y += blob.speed;
      ctx.beginPath();
      ctx.arc(blob.x, blob.y, blob.size, 0, 2 * Math.PI);
      ctx.fillStyle = `hsl(${blob.y % 360}, 100%, 50%)`;
      ctx.fill();
    });
}

function mapRange(value, inMin, inMax, outMin, outMax) {
  return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

playButton.addEventListener('click', (e) => {
  startAudio();
  playButton.style.display = "none";
});
