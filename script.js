let timeLeft;
let milliseconds = 0;
let timerId = null;
let isWorkMode = true;

const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const millisecondsDisplay = document.getElementById('milliseconds');
const startButton = document.getElementById('start');
const pauseButton = document.getElementById('pause');
const resetButton = document.getElementById('reset');
const workButton = document.getElementById('work');
const breakButton = document.getElementById('break');

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const msString = milliseconds.toString().padStart(3, '0');
    const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${msString}`;
    
    // Update the display
    minutesDisplay.textContent = minutes.toString().padStart(2, '0');
    secondsDisplay.textContent = seconds.toString().padStart(2, '0');
    millisecondsDisplay.textContent = msString;
    
    // Update the browser tab title
    document.title = `${timeString} - ${isWorkMode ? 'Work' : 'Break'} Timer`;
}

function startTimer() {
    if (timerId === null) {
        startButton.classList.add('active');
        pauseButton.classList.remove('active');
        
        // Main timer for seconds
        timerId = setInterval(() => {
            timeLeft--;
            milliseconds = 999; // Reset milliseconds when second changes
            updateDisplay();
            if (timeLeft === 0) {
                clearInterval(timerId);
                clearInterval(msTimerId);
                timerId = null;
                startButton.classList.remove('active');
                alert(isWorkMode ? 'Work session completed! Take a break!' : 'Break is over! Back to work!');
                resetTimer();
            }
        }, 1000);

        // Separate timer for milliseconds
        let msTimerId = setInterval(() => {
            milliseconds -= 10;
            if (milliseconds < 0) milliseconds = 990;
            updateDisplay();
        }, 10);

        // Store both timer IDs
        timerId = {
            main: timerId,
            ms: msTimerId
        };
    }
}

function pauseTimer() {
    if (timerId) {
        clearInterval(timerId.main);
        clearInterval(timerId.ms);
        timerId = null;
    }
    startButton.classList.remove('active');
    pauseButton.classList.add('active');
    setTimeout(() => pauseButton.classList.remove('active'), 200);
}

function resetTimer() {
    if (timerId) {
        clearInterval(timerId.main);
        clearInterval(timerId.ms);
        timerId = null;
    }
    timeLeft = isWorkMode ? 25 * 60 : 5 * 60;
    milliseconds = 0;
    updateDisplay();
    startButton.classList.remove('active');
    pauseButton.classList.remove('active');
    resetButton.classList.add('active');
    setTimeout(() => resetButton.classList.remove('active'), 200);
}

function switchMode(mode) {
    isWorkMode = mode === 'work';
    workButton.classList.toggle('active', isWorkMode);
    breakButton.classList.toggle('active', !isWorkMode);
    resetTimer();
}

// Initialize
timeLeft = 25 * 60;
updateDisplay();

// Event listeners
startButton.addEventListener('click', startTimer);
pauseButton.addEventListener('click', pauseTimer);
resetButton.addEventListener('click', resetTimer);
workButton.addEventListener('click', () => switchMode('work'));
breakButton.addEventListener('click', () => switchMode('break')); 