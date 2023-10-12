let n = 500;
let width = 400;
const array = [];
let moves = [];
let speed = 50;
let volume;

let audioCtx = null;

init();

function playNote(freq) {
    if (audioCtx == null) {
        audioCtx = new (AudioContext || webkitAudioContext || window.webkitAudioContext)();
    }
    const dur = (101 - speed) / 100;
    const osc = audioCtx.createOscillator();
    osc.frequency.value = freq;
    osc.start();
    osc.stop(audioCtx.currentTime + dur);
    const node = audioCtx.createGain();
    node.gain.value = volume / 250;
    node.gain.linearRampToValueAtTime(0, audioCtx.currentTime + dur);
    osc.connect(node);
    node.connect(audioCtx.destination);

}

function init() {
    n = document.getElementById("array_size").value;
    for (let i = 0; i < n; i++) {
        array[i] = (i + 1) / n;
    }

    shuffle(array);
    showBars(array);

}

function isSorted(array) {
    for (let i = 0; i < array.length - 1; i++) {
        if (array[i] > array[i + 1]) {
            return false;
        }
    }
    return true;
}

function shuffle(array) {
    let currentSize = array.length;
    let randomIndex;

    while (currentSize > 0) {
        randomIndex = Math.floor(Math.random() * currentSize);
        currentSize--;

        [array[currentSize], array[randomIndex]] = [
            array[randomIndex], array[currentSize]];
    }

    return array;
}

function showBars(array, move) {
    container.innerHTML = "";
    for (let i = 0; i < n; i++) {
        const bar = document.createElement("div");
        bar.style.height = array[i] * 100 + "%";
        bar.style.width = (width / n) + "px";
        bar.style.margin = (width / (n * 10)) + "px"

        let hue = (array[i] * 100) + 180;
        bar.style.backgroundColor = `hsl(${hue}, 100%, 50%)`;

        bar.classList.add("bar");

        if (move && move.indicies.includes(i)) {
            bar.style.backgroundColor = move.type == "swap" ? "red" : "white";
        }

        container.appendChild(bar);
    }
}

function showBarsEnd(array) {
    container.innerHTML = "";
    for (let i = 0; i < n; i++) {
        const bar = document.createElement("div");
        bar.style.height = array[i] * 100 + "%";
        bar.style.width = (width / n) + "px";
        bar.style.margin = (width / (n * 10)) + "px"
        
        let hue = (array[i] * 100) + 180;
        bar.style.backgroundColor = `hsl(${hue}, 100%, 50%)`;

        bar.classList.add("bar");

        container.appendChild(bar);
    }
}

function updateSpeed() {
    speed = document.getElementById("speed").value;
}

function updateVolume() {
    volume = document.getElementById("volume").value
}

function playBubbleSort() {
    if (!isSorted(array)) {
        updateSpeed()
        const copy = [...array];
        moves = [];
        bubbleSort(copy);
        animate(moves);
    }

}

function playQuickSort() {
    if (!isSorted(array)) {
        updateSpeed()
        const copy = [...array];
        moves = [];
        quickSort(copy, 0, copy.length - 1);
        animate(moves);
    }
}

function playInsertionSort() {
    if (!isSorted(array)) {
        updateSpeed()
        const copy = [...array];
        moves = [];
        insertionSort(copy);
        animate(moves);
    }
}

function playHeapSort() {
    if (!isSorted(array)) {
        updateSpeed()
        const copy = [...array];
        moves = [];
        heapSort(copy);
        animate(moves);
    }
}

function playMergeSort() {
    if (!isSorted(array)) {
        updateSpeed()
        const copy = [...array];
        moves = [];
        mergeSort(copy, 0, copy.length - 1);
        animate(moves);
    }
}


// Recursively goes through each swap and animates it
function animate(moves) {
    if (moves.length == 0) {
        showBarsEnd(array);
        return;
    }

    const move = moves.shift();
    const [i, j] = move.indicies;

    playNote(200 + array[i] * 500);
    playNote(200 + array[j] * 500);

    if (move.type == "swap") {
        [array[i], array[j]] = [array[j], array[i]];
    }

    showBars(array, move);

    setTimeout(function () {
        animate(moves);
    }, 100 - speed);
}

function bubbleSort(array) {
    do {
        var swapped = false;
        for (let i = 1; i < array.length; i++) {
            moves.push({ indicies: [i, i - 1], type: "comp" });
            if (array[i - 1] > array[i]) {
                swapped = true;

                //moves array[i-1] <=> array[i]
                [array[i], array[i - 1]] = [array[i - 1], array[i]];

                //Pushes the change to the swap liist
                moves.push({ indicies: [i, i - 1], type: "swap" });

            }
        }
    } while (swapped);
}

function quickSort(array, start, end) {
    if (start >= end) {
        return;
    }

    let index = partition(array, start, end);

    quickSort(array, start, index - 1);
    quickSort(array, index + 1, end);
}

function partition(array, start, end) {
    let pivotIndex = start;
    let pivotValue = array[end];

    for (let i = start; i < end; i++) {
        moves.push({ indicies: [i, pivotIndex], type: "comp" });
        if (array[i] < pivotValue) {
            [array[i], array[pivotIndex]] = [array[pivotIndex], array[i]];
            moves.push({ indicies: [i, pivotIndex], type: "swap" });
            pivotIndex++;
        }
    }

    moves.push({ indicies: [end, pivotIndex], type: "swap" });
    [array[pivotIndex], array[end]] = [array[end], array[pivotIndex]];
    return pivotIndex;
}

function insertionSort(array) {
    for (let i = 1; i < array.length; i++) {
        let currentValue = array[i]
        let j;
        for (j = i - 1; j >= 0 && array[j] > currentValue; j--) {
            moves.push({ indicies: [j + 1, j], type: "comp" })
            moves.push({ indicies: [j + 1, j], type: "swap" })
            array[j + 1] = array[j]
        }
        array[j + 1] = currentValue
    }
    return array;
}

function heapSort(arr) {
    var N = arr.length;

    for (var i = Math.floor(N / 2) - 1; i >= 0; i--)
        heapify(arr, N, i);

    for (var i = N - 1; i > 0; i--) {
        moves.push({ indicies: [i, 0], type: "swap" });
        [arr[i], arr[0]] = [arr[0], arr[i]];

        heapify(arr, i, 0);
    }

}

function heapify(arr, length, i) {
    var largest = i;
    var l = 2 * i + 1;
    var r = 2 * i + 2;

    moves.push({ indicies: [i, largest], type: "comp" });
    if (l < length && arr[l] > arr[largest])
        largest = l;

    moves.push({ indicies: [i, largest], type: "comp" });
    if (r < length && arr[r] > arr[largest])
        largest = r;

    if (largest != i) {
        moves.push({ indicies: [i, largest], type: "swap" });
        [arr[i], arr[largest]] = [arr[largest], arr[i]];

        heapify(arr, length, largest);
    }
}

function merge(array, left, mid, end) {
    let left2 = mid + 1;

    if (array[mid] <= array[left2]) {
        return;
    }

    while (left <= mid && left2 <= end) {

        moves.push({ indicies: [left, left2], type: "comp" });
        if (array[left] <= array[left2]) {
            left++;
        }
        else {
            let value = array[left2];
            let index = left2;

            while (index != left) {
                moves.push({ indicies: [index, index - 1], type: "swap" });
                array[index] = array[index - 1];
                index--;
            }
            array[left] = value;

            left++;
            mid++;
            left2++;
        }
    }
}

function mergeSort(array, l, r) {
    if (l < r) {
        let m = l + Math.floor((r - l) / 2);

        mergeSort(array, l, m);
        mergeSort(array, m + 1, r);

        merge(array, l, m, r);
    }
}