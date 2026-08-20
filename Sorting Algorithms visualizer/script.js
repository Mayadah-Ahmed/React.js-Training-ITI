const algorithmInfo = {
  bubble: {
    label: "Bubble Sort",
    description:
      "Repeatedly compares adjacent values and swaps them if they are in the wrong order. It is simple to understand and excellent for visualizing the basic idea of sorting.",
    best: "O(n)",
    average: "O(n²)",
    worst: "O(n²)",
    space: "O(1)",
  },
  selection: {
    label: "Selection Sort",
    description:
      "Finds the smallest remaining value and moves it into place one step at a time. It keeps the sorted portion on the left while scanning the unsorted portion.",
    best: "O(n²)",
    average: "O(n²)",
    worst: "O(n²)",
    space: "O(1)",
  },
  insertion: {
    label: "Insertion Sort",
    description:
      "Builds the final sorted array one item at a time by inserting each value into its correct position among the already sorted bars.",
    best: "O(n)",
    average: "O(n²)",
    worst: "O(n²)",
    space: "O(1)",
  },
  merge: {
    label: "Merge Sort",
    description:
      "Divides the array into halves, recursively sorts each half, and then merges the two sorted parts back together in order.",
    best: "O(n log n)",
    average: "O(n log n)",
    worst: "O(n log n)",
    space: "O(n)",
  },
  quick: {
    label: "Quick Sort",
    description:
      "Picks a pivot, partitions surrounding values into smaller and larger groups, and recursively sorts each partition around the pivot.",
    best: "O(n log n)",
    average: "O(n log n)",
    worst: "O(n²)",
    space: "O(log n) average",
  },
};

const state = {
  algorithm: "bubble",
  array: [],
  originalArray: [],
  size: 22,
  speed: 70,
  comparisons: 0,
  swaps: 0,
  sortingInProgress: false,
  compareIndices: [],
  swapIndices: [],
  sortedIndices: [],
};

const elements = {
  body: document.body,
  algorithmSelect: document.getElementById("algorithmSelect"),
  sizeRange: document.getElementById("sizeRange"),
  speedRange: document.getElementById("speedRange"),
  sizeValue: document.getElementById("sizeValue"),
  speedValue: document.getElementById("speedValue"),
  barsContainer: document.getElementById("barsContainer"),
  selectedAlgorithmLabel: document.getElementById("selectedAlgorithmLabel"),
  comparisonsStat: document.getElementById("comparisonsStat"),
  swapsStat: document.getElementById("swapsStat"),
  timeComplexity: document.getElementById("timeComplexity"),
  spaceComplexity: document.getElementById("spaceComplexity"),
  algorithmTitle: document.getElementById("algorithmTitle"),
  algorithmDescription: document.getElementById("algorithmDescription"),
  bestComplexity: document.getElementById("bestComplexity"),
  averageComplexity: document.getElementById("averageComplexity"),
  worstComplexity: document.getElementById("worstComplexity"),
  spaceComplexityBox: document.getElementById("spaceComplexityBox"),
  generateBtn: document.getElementById("generateBtn"),
  startBtn: document.getElementById("startBtn"),
  resetBtn: document.getElementById("resetBtn"),
};

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRandomArray(length = state.size) {
  return Array.from({ length }, () => randomInt(10, 100));
}

function getDelay() {
  return Math.max(20, 180 - state.speed * 1.4);
}

function updateSizeValue() {
  elements.sizeValue.textContent = state.size;
}

function updateSpeedValue() {
  elements.speedValue.textContent = state.speed;
}

function updateStatsDisplay() {
  const currentInfo = algorithmInfo[state.algorithm];
  elements.selectedAlgorithmLabel.textContent = currentInfo.label;
  elements.comparisonsStat.textContent = state.comparisons;
  elements.swapsStat.textContent = state.swaps;
  elements.timeComplexity.textContent = currentInfo.average;
  elements.spaceComplexity.textContent = currentInfo.space;
}

function updateAlgorithmInfo() {
  const active = algorithmInfo[state.algorithm];
  elements.algorithmTitle.textContent = active.label;
  elements.algorithmDescription.textContent = active.description;
  elements.bestComplexity.textContent = active.best;
  elements.averageComplexity.textContent = active.average;
  elements.worstComplexity.textContent = active.worst;
  elements.spaceComplexityBox.textContent = active.space;
  elements.selectedAlgorithmLabel.textContent = active.label;
  elements.timeComplexity.textContent = active.average;
  elements.spaceComplexity.textContent = active.space;
}

function renderBars() {
  const maxValue = Math.max(...state.array, 1);
  elements.barsContainer.innerHTML = "";

  state.array.forEach((value, index) => {
    const bar = document.createElement("div");
    bar.className = "bar";
    bar.style.height = `${(value / maxValue) * 100}%`;
    bar.title = `Value: ${value}`;

    if (state.sortedIndices.includes(index)) {
      bar.classList.add("sorted");
    }

    if (state.compareIndices.includes(index)) {
      bar.classList.add("compare");
    }

    if (state.swapIndices.includes(index)) {
      bar.classList.add("swap");
    }

    elements.barsContainer.appendChild(bar);
  });
}

function setControlState(disabled) {
  elements.algorithmSelect.disabled = disabled;
  elements.sizeRange.disabled = disabled;
  elements.speedRange.disabled = disabled;
  elements.generateBtn.disabled = disabled;
  elements.resetBtn.disabled = disabled;
  elements.startBtn.disabled = disabled;
}

function resetCounters() {
  state.comparisons = 0;
  state.swaps = 0;
  updateStatsDisplay();
}

function createVisualState({ compare = [], swap = [], sorted = [] } = {}) {
  state.compareIndices = [...compare];
  state.swapIndices = [...swap];
  state.sortedIndices = Array.from(new Set(sorted));
  renderBars();
}

function waitForAnimation() {
  return new Promise((resolve) => {
    setTimeout(resolve, getDelay());
  });
}

function clearVisualState() {
  state.compareIndices = [];
  state.swapIndices = [];
  state.sortedIndices = [];
  renderBars();
}

function markAllSorted() {
  state.sortedIndices = Array.from(
    { length: state.array.length },
    (_, index) => index,
  );
  state.compareIndices = [];
  state.swapIndices = [];
  renderBars();
}

function resetArray() {
  if (state.sortingInProgress) {
    return;
  }

  state.array = [...state.originalArray];
  state.comparisons = 0;
  state.swaps = 0;
  state.compareIndices = [];
  state.swapIndices = [];
  state.sortedIndices = [];
  renderBars();
  updateStatsDisplay();
}

function generateNewArray() {
  if (state.sortingInProgress) {
    return;
  }

  state.originalArray = generateRandomArray(state.size);
  state.array = [...state.originalArray];
  state.comparisons = 0;
  state.swaps = 0;
  state.compareIndices = [];
  state.swapIndices = [];
  state.sortedIndices = [];
  renderBars();
  updateStatsDisplay();
}

async function bubbleSort() {
  const n = state.array.length;
  const sortedMask = Array(n).fill(false);

  for (let i = 0; i < n; i += 1) {
    let swappedThisPass = false;

    for (let j = 0; j < n - i - 1; j += 1) {
      state.comparisons += 1;
      updateStatsDisplay();
      createVisualState({
        compare: [j, j + 1],
        sorted: sortedMask
          .map((value, index) => (value ? index : -1))
          .filter((value) => value !== -1),
      });
      await waitForAnimation();

      if (state.array[j] > state.array[j + 1]) {
        [state.array[j], state.array[j + 1]] = [
          state.array[j + 1],
          state.array[j],
        ];
        state.swaps += 1;
        updateStatsDisplay();
        createVisualState({
          compare: [j, j + 1],
          swap: [j, j + 1],
          sorted: sortedMask
            .map((value, index) => (value ? index : -1))
            .filter((value) => value !== -1),
        });
        await waitForAnimation();
        swappedThisPass = true;
      }
    }

    sortedMask[n - i - 1] = true;
    createVisualState({
      sorted: sortedMask
        .map((value, index) => (value ? index : -1))
        .filter((value) => value !== -1),
    });
    await waitForAnimation();

    if (!swappedThisPass) {
      for (let k = 0; k < n - i; k += 1) {
        sortedMask[k] = true;
      }
      createVisualState({
        sorted: sortedMask
          .map((value, index) => (value ? index : -1))
          .filter((value) => value !== -1),
      });
      await waitForAnimation();
      break;
    }
  }

  markAllSorted();
}

async function selectionSort() {
  const n = state.array.length;
  const sortedMask = Array(n).fill(false);

  for (let i = 0; i < n; i += 1) {
    let minIndex = i;

    for (let j = i + 1; j < n; j += 1) {
      state.comparisons += 1;
      updateStatsDisplay();
      createVisualState({
        compare: [minIndex, j],
        sorted: sortedMask
          .map((value, index) => (value ? index : -1))
          .filter((value) => value !== -1),
      });
      await waitForAnimation();

      if (state.array[j] < state.array[minIndex]) {
        minIndex = j;
      }
    }

    if (minIndex !== i) {
      [state.array[i], state.array[minIndex]] = [
        state.array[minIndex],
        state.array[i],
      ];
      state.swaps += 1;
      updateStatsDisplay();
      createVisualState({
        compare: [i, minIndex],
        swap: [i, minIndex],
        sorted: sortedMask
          .map((value, index) => (value ? index : -1))
          .filter((value) => value !== -1),
      });
      await waitForAnimation();
    }

    sortedMask[i] = true;
    createVisualState({
      sorted: sortedMask
        .map((value, index) => (value ? index : -1))
        .filter((value) => value !== -1),
    });
    await waitForAnimation();
  }

  markAllSorted();
}

async function insertionSort() {
  const n = state.array.length;

  for (let i = 1; i < n; i += 1) {
    let j = i;
    const sortedIndices = Array.from({ length: i }, (_, index) => index);

    while (j > 0) {
      state.comparisons += 1;
      updateStatsDisplay();
      createVisualState({ compare: [j - 1, j], sorted: sortedIndices });
      await waitForAnimation();

      if (state.array[j - 1] <= state.array[j]) {
        break;
      }

      [state.array[j - 1], state.array[j]] = [
        state.array[j],
        state.array[j - 1],
      ];
      state.swaps += 1;
      updateStatsDisplay();
      createVisualState({
        compare: [j - 1, j],
        swap: [j - 1, j],
        sorted: sortedIndices,
      });
      await waitForAnimation();
      j -= 1;
    }

    const currentSorted = Array.from({ length: i + 1 }, (_, index) => index);
    createVisualState({ sorted: currentSorted });
    await waitForAnimation();
  }

  markAllSorted();
}

async function mergeSortRecursive(left, right) {
  if (left >= right) {
    return;
  }

  const mid = Math.floor((left + right) / 2);
  await mergeSortRecursive(left, mid);
  await mergeSortRecursive(mid + 1, right);
  await mergeHalves(left, mid, right);
}

async function mergeHalves(left, mid, right) {
  const leftArray = state.array.slice(left, mid + 1);
  const rightArray = state.array.slice(mid + 1, right + 1);
  let leftPointer = 0;
  let rightPointer = 0;
  let arrayPointer = left;

  while (leftPointer < leftArray.length && rightPointer < rightArray.length) {
    state.comparisons += 1;
    updateStatsDisplay();
    createVisualState({
      compare: [left + leftPointer, mid + 1 + rightPointer],
      sorted: Array.from(
        { length: right - left + 1 },
        (_, index) => left + index,
      ).slice(0, arrayPointer - left),
    });
    await waitForAnimation();

    if (leftArray[leftPointer] <= rightArray[rightPointer]) {
      state.array[arrayPointer] = leftArray[leftPointer];
      leftPointer += 1;
    } else {
      state.array[arrayPointer] = rightArray[rightPointer];
      state.swaps += 1;
      rightPointer += 1;
    }

    updateStatsDisplay();
    createVisualState({
      swap: [arrayPointer],
      sorted: Array.from(
        { length: right - left + 1 },
        (_, index) => left + index,
      ).slice(0, arrayPointer - left + 1),
    });
    await waitForAnimation();
    arrayPointer += 1;
  }

  while (leftPointer < leftArray.length) {
    state.array[arrayPointer] = leftArray[leftPointer];
    leftPointer += 1;
    arrayPointer += 1;
  }

  while (rightPointer < rightArray.length) {
    state.array[arrayPointer] = rightArray[rightPointer];
    rightPointer += 1;
    arrayPointer += 1;
  }

  const sortedRange = Array.from(
    { length: right - left + 1 },
    (_, index) => left + index,
  );
  createVisualState({ sorted: sortedRange });
  await waitForAnimation();
}

async function mergeSort() {
  await mergeSortRecursive(0, state.array.length - 1);
  markAllSorted();
}

async function partition(low, high) {
  const pivotValue = state.array[high];
  let smallerIndex = low;

  for (let currentIndex = low; currentIndex < high; currentIndex += 1) {
    state.comparisons += 1;
    updateStatsDisplay();
    createVisualState({
      compare: [currentIndex, high],
      sorted: state.sortedIndices,
    });
    await waitForAnimation();

    if (state.array[currentIndex] < pivotValue) {
      [state.array[smallerIndex], state.array[currentIndex]] = [
        state.array[currentIndex],
        state.array[smallerIndex],
      ];
      state.swaps += 1;
      updateStatsDisplay();
      createVisualState({
        swap: [smallerIndex, currentIndex],
        sorted: state.sortedIndices,
      });
      await waitForAnimation();
      smallerIndex += 1;
    }
  }

  [state.array[smallerIndex], state.array[high]] = [
    state.array[high],
    state.array[smallerIndex],
  ];
  state.swaps += 1;
  updateStatsDisplay();
  createVisualState({
    swap: [smallerIndex, high],
    sorted: [...state.sortedIndices, smallerIndex],
  });
  await waitForAnimation();

  return smallerIndex;
}

async function quickSortRecursive(low, high) {
  if (low >= high) {
    return;
  }

  const pivotIndex = await partition(low, high);
  await quickSortRecursive(low, pivotIndex - 1);
  await quickSortRecursive(pivotIndex + 1, high);
}

async function quickSort() {
  await quickSortRecursive(0, state.array.length - 1);
  markAllSorted();
}

async function startSorting() {
  if (state.sortingInProgress) {
    return;
  }

  state.sortingInProgress = true;
  setControlState(true);
  state.array = [...state.originalArray];
  state.comparisons = 0;
  state.swaps = 0;
  state.compareIndices = [];
  state.swapIndices = [];
  state.sortedIndices = [];
  updateStatsDisplay();
  renderBars();

  try {
    const sortMap = {
      bubble: bubbleSort,
      selection: selectionSort,
      insertion: insertionSort,
      merge: mergeSort,
      quick: quickSort,
    };

    await sortMap[state.algorithm]();
  } finally {
    state.sortingInProgress = false;
    setControlState(false);
    markAllSorted();
  }
}

function changeAlgorithm(event) {
  state.algorithm = event.target.value;
  updateAlgorithmInfo();
  if (!state.sortingInProgress) {
    state.array = [...state.originalArray];
    resetCounters();
    clearVisualState();
    renderBars();
  }
}

function changeArraySize(event) {
  const nextSize = Number(event.target.value);
  state.size = nextSize;
  updateSizeValue();

  if (!state.sortingInProgress) {
    state.originalArray = generateRandomArray(nextSize);
    state.array = [...state.originalArray];
    resetCounters();
    clearVisualState();
    renderBars();
  }
}

function changeSpeed(event) {
  state.speed = Number(event.target.value);
  updateSpeedValue();
}

elements.algorithmSelect.addEventListener("change", changeAlgorithm);
elements.sizeRange.addEventListener("input", changeArraySize);
elements.speedRange.addEventListener("input", changeSpeed);
elements.generateBtn.addEventListener("click", generateNewArray);
elements.startBtn.addEventListener("click", startSorting);
elements.resetBtn.addEventListener("click", resetArray);

function initialize() {
  state.size = Number(elements.sizeRange.value);
  updateSizeValue();
  updateSpeedValue();
  state.originalArray = generateRandomArray(state.size);
  state.array = [...state.originalArray];
  resetCounters();
  updateAlgorithmInfo();
  renderBars();
}

window.sortingVisualizer = {
  state,
  initialize,
  generateNewArray,
  resetArray,
  startSorting,
  algorithmInfo,
};

initialize();
