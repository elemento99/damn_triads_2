
const piano = new Tone.Sampler({
    urls: {
        A0: 'A0.mp3',
        C1: 'C1.mp3',
        'D#1': 'Ds1.mp3',
        'F#1': 'Fs1.mp3',
        A1: 'A1.mp3',
        C2: 'C2.mp3',
        'D#2': 'Ds2.mp3',
        'F#2': 'Fs2.mp3',
        A2: 'A2.mp3',
        C3: 'C3.mp3',
        'D#3': 'Ds3.mp3',
        'F#3': 'Fs3.mp3',
        A3: 'A3.mp3',
        C4: 'C4.mp3',
        'D#4': 'Ds4.mp3',
        'F#4': 'Fs4.mp3',
        A4: 'A4.mp3',
        C5: 'C5.mp3',
        'D#5': 'Ds5.mp3',
        'F#5': 'Fs5.mp3',
        A5: 'A5.mp3',
        C6: 'C6.mp3',
        'D#6': 'Ds6.mp3',
        'F#6': 'Fs6.mp3',
        A6: 'A6.mp3',
        C7: 'C7.mp3',
        'D#7': 'Ds7.mp3',
        'F#7': 'Fs7.mp3',
        A7: 'A7.mp3',
        C8: 'C8.mp3',
    },
    release: 1,
    baseUrl: 'https://tonejs.github.io/audio/salamander/',
}).toDestination();



let selectedValues = [];
let cyclicScaleSubset = [];
const keyInput = document.getElementById('key');
const displayElement = document.getElementById('selected-values');
const selectors = document.querySelectorAll('.selector');

class CyclicArray {
    constructor(array) {
        this.array = array;
    }

    get(index) {
        const length = this.array.length;
        const cyclicIndex = ((index % length) + length) % length;
        return this.array[cyclicIndex];
    }

    set(index, value) {
        const length = this.array.length;
        const cyclicIndex = ((index % length) + length) % length;
        this.array[cyclicIndex] = value;
    }

    size() {
        return this.array.length;
    }
}

const notas = [
    "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"
];

const cyclicNotas = new CyclicArray(notas);
function initSelectors() {
    selectors.forEach((selector, index) => {
        for (let i = 1; i <= 4; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i;
            selector.appendChild(option);
        }

        // Establecer el valor por defecto según el índice
        switch (index) {
            case 0:
            case 1:
            case 3:
            case 4:
            case 5:
                selector.value = 2;
                break;
            case 2:
                selector.value = 1;
                break;
        }
    });

    updateOptions();
}

function calculateSum() {
    return Array.from(selectors).reduce((sum, selector) => sum + parseInt(selector.value), 0);
}

function updateOptions() {
    const sum = calculateSum();

    selectors.forEach((selector) => {
        const selectedValue = parseInt(selector.value);
        const maxValue = Math.min(4, 11 - sum + selectedValue);
        const options = selector.querySelectorAll('option');

        options.forEach((option) => {
            const optionValue = parseInt(option.value);
            option.disabled = optionValue > maxValue;
        });
    });
}

selectors.forEach((selector) => {
    selector.addEventListener('change', updateOptions);
});

initSelectors();

function displaySelectedValues() {
    selectedValues = Array.from(selectors).map(selector => parseInt(selector.value));
    displayElement.textContent = `Valores seleccionados: ${selectedValues.join(', ')}`;
}

function displayCyclicScaleSubset() {
    displayElement.textContent = `Cyclic Scale Subset: ${cyclicScaleSubset.array.join(', ')}`;
}

selectors.forEach((selector) => {
    selector.addEventListener('change', displaySelectedValues);
});

displaySelectedValues();

function generateSubset(key, selectedValues) {
    const keyIndex = cyclicNotas.array.indexOf(key);
    let subset = [];
    let currentIndex = keyIndex;

    subset.push(cyclicNotas.get(currentIndex));

    for (let i = 0; i < 6; i++) {
        const selectorValue = selectedValues[i % selectedValues.length];
        currentIndex = (currentIndex + selectorValue) % cyclicNotas.size();
        subset.push(cyclicNotas.get(currentIndex));
    }

    return subset;
}

function updateSubset() {
    const key = keyInput.value;
    cyclicScaleSubset = new CyclicArray(generateSubset(key, selectedValues));
    displayCyclicScaleSubset();
}

keyInput.addEventListener('change', updateSubset);

selectors.forEach((selector) => {
    selector.addEventListener('change', () => {
        selectedValues = Array.from(selectors).map(selector => parseInt(selector.value));
        updateSubset();
    });
});

updateSubset();

console.log(cyclicScaleSubset)































let allSelected = false;

// Event listeners para las casillas de la cabecera
document.getElementById('toggle-normal-triad').addEventListener('change', (event) => {
    document.querySelectorAll('.normal-triad').forEach((checkbox) => {
        checkbox.checked = event.target.checked;
        const row = checkbox.dataset.row;
        toggleInversions(row);
    });
});

document.getElementById('toggle-seven-note').addEventListener('change', (event) => {
    document.querySelectorAll('.seven-note').forEach((checkbox) => {
        checkbox.checked = event.target.checked;
        const row = checkbox.dataset.row;
        toggleInversions(row);
        toggleThirdInversion(row, event.target.checked);
    });
});

document.getElementById('toggle-first-inversion').addEventListener('change', (event) => {
    document.querySelectorAll('.first-inversion').forEach((checkbox) => {
        checkbox.checked = event.target.checked;
    });
});

document.getElementById('toggle-second-inversion').addEventListener('change', (event) => {
    document.querySelectorAll('.second-inversion').forEach((checkbox) => {
        checkbox.checked = event.target.checked;
    });
});

document.getElementById('toggle-third-inversion').addEventListener('change', (event) => {
    document.querySelectorAll('.third-inversion').forEach((checkbox) => {
        checkbox.checked = event.target.checked;
    });
});

// Cambiar el estado de las inversiones dependiendo de las casillas
function toggleInversions(row) {
    const normalTriad = document.querySelector(`#normal-triad-${row}`).checked;
    const sevenNote = document.querySelector(`#seven-note-${row}`).checked;

    const enable = normalTriad || sevenNote;

    document.querySelector(`#first-inversion-${row}`).disabled = !enable;
    document.querySelector(`#second-inversion-${row}`).disabled = !enable;

    if (!enable) {
        document.querySelector(`#first-inversion-${row}`).checked = false;
        document.querySelector(`#second-inversion-${row}`).checked = false;
    }
}

function toggleThirdInversion(row, isEnabled) {
    const thirdInversionCheckbox = document.querySelector(`#third-inversion-${row}`);
    if (isEnabled) {
        thirdInversionCheckbox.disabled = false;
    } else {
        thirdInversionCheckbox.disabled = true;
        thirdInversionCheckbox.checked = false;
    }
}

document.getElementById('selectAllBtn').addEventListener('click', () => {
    allSelected = !allSelected;
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = allSelected;

        const row = checkbox.dataset.row;

        if (checkbox.classList.contains('seven-note')) {
            toggleThirdInversion(row, allSelected);
        }
        if (checkbox.classList.contains('normal-triad') || checkbox.classList.contains('seven-note')) {
            toggleInversions(row);
        }
    });
    document.getElementById('selectAllBtn').textContent = allSelected ? 'Desmarcar Todas' : 'Marcar Todas';
    console.log(allSelected ? "Todas las casillas marcadas." : "Todas las casillas desmarcadas.");
});



let chunks = [];
let chunksAuxiliar = [];
















// desde aquí en adelante solo recibo el chunks y el cyclicScaleSubset
console.log("este es el chunk auxiliar q me está llegando desde el front end", chunksAuxiliar)
console.log("este es la escala q me llega del front", cyclicScaleSubset)


let selectedTriads = [];

const triadPatterns = [
    { name: "normal-triad-1", pattern: [0, 2, 4] },
    { name: "normal-triad-first-inversion-1", pattern: [2, 4, 0] },
    { name: "normal-triad-second-inversion-1", pattern: [4, 0, 2] },
    { name: "normal-triad-third-inversion-1", pattern: [6, 1, 3] },

    { name: "normal-triad-2", pattern: [1, 3, 5] },
    { name: "normal-triad-first-inversion-2", pattern: [3, 5, 1] },
    { name: "normal-triad-second-inversion-2", pattern: [5, 1, 3] },
    { name: "normal-triad-third-inversion-2", pattern: [0, 2, 4] },

    { name: "normal-triad-3", pattern: [2, 4, 6] },
    { name: "normal-triad-first-inversion-3", pattern: [4, 6, 2] },
    { name: "normal-triad-second-inversion-3", pattern: [6, 2, 4] },
    { name: "normal-triad-third-inversion-3", pattern: [1, 3, 5] },

    { name: "normal-triad-4", pattern: [3, 5, 0] },
    { name: "normal-triad-first-inversion-4", pattern: [5, 0, 3] },
    { name: "normal-triad-second-inversion-4", pattern: [0, 3, 5] },
    { name: "normal-triad-third-inversion-4", pattern: [2, 4, 6] },

    { name: "normal-triad-5", pattern: [4, 6, 1] },
    { name: "normal-triad-first-inversion-5", pattern: [6, 1, 4] },
    { name: "normal-triad-second-inversion-5", pattern: [1, 4, 6] },
    { name: "normal-triad-third-inversion-5", pattern: [3, 5, 0] },

    { name: "normal-triad-6", pattern: [5, 0, 2] },
    { name: "normal-triad-first-inversion-6", pattern: [0, 2, 5] },
    { name: "normal-triad-second-inversion-6", pattern: [2, 5, 0] },
    { name: "normal-triad-third-inversion-6", pattern: [4, 6, 1] },

    { name: "normal-triad-7", pattern: [6, 1, 3] },
    { name: "normal-triad-first-inversion-7", pattern: [1, 3, 6] },
    { name: "normal-triad-second-inversion-7", pattern: [3, 6, 1] },
    { name: "normal-triad-third-inversion-7", pattern: [6, 1, 3] },
];
const sevenNotePatterns = [
    { name: "seven-note-1", pattern: [0, 2, 4, 6] },
    { name: "seven-note-first-inversion-1", pattern: [2, 4, 6, 0] },
    { name: "seven-note-second-inversion-1", pattern: [4, 6, 0, 2] },
    { name: "seven-note-third-inversion-1", pattern: [6, 0, 2, 4] },

    { name: "seven-note-2", pattern: [1, 3, 5, 7] },
    { name: "seven-note-first-inversion-2", pattern: [3, 5, 7, 1] },
    { name: "seven-note-second-inversion-2", pattern: [5, 7, 1, 3] },
    { name: "seven-note-third-inversion-2", pattern: [7, 1, 3, 5] },

    { name: "seven-note-3", pattern: [2, 4, 6, 8] },
    { name: "seven-note-first-inversion-3", pattern: [4, 6, 8, 2] },
    { name: "seven-note-second-inversion-3", pattern: [6, 8, 2, 4] },
    { name: "seven-note-third-inversion-3", pattern: [8, 2, 4, 6] },

    { name: "seven-note-4", pattern: [3, 5, 7, 9] },
    { name: "seven-note-first-inversion-4", pattern: [5, 7, 9, 3] },
    { name: "seven-note-second-inversion-4", pattern: [7, 9, 3, 5] },
    { name: "seven-note-third-inversion-4", pattern: [9, 3, 5, 7] },

    { name: "seven-note-5", pattern: [4, 6, 8, 10] },
    { name: "seven-note-first-inversion-5", pattern: [6, 8, 10, 4] },
    { name: "seven-note-second-inversion-5", pattern: [8, 10, 4, 6] },
    { name: "seven-note-third-inversion-5", pattern: [10, 4, 6, 8] },

    { name: "seven-note-6", pattern: [5, 7, 9, 11] },
    { name: "seven-note-first-inversion-6", pattern: [7, 9, 11, 5] },
    { name: "seven-note-second-inversion-6", pattern: [9, 11, 5, 7] },
    { name: "seven-note-third-inversion-6", pattern: [11, 5, 7, 9] },

    { name: "seven-note-7", pattern: [6, 8, 10, 12] },
    { name: "seven-note-first-inversion-7", pattern: [8, 10, 12, 6] },
    { name: "seven-note-second-inversion-7", pattern: [10, 12, 6, 8] },
    { name: "seven-note-third-inversion-7", pattern: [12, 6, 8, 10] }
];

function generateSelectedTriads(cyclicScales, chunks) {
    triadPatterns.forEach(pattern => {
        if (chunks.includes(pattern.name)) {
            const triad = pattern.pattern.map(index => cyclicScales.get(index));
            selectedTriads.push(triad);

        }
    });
    sevenNotePatterns.forEach(pattern => {
        if (chunks.includes(pattern.name)) {
            const triad = pattern.pattern.map(index => cyclicScales.get(index));
            selectedTriads.push(triad);

        }
    });
}































const allPianoNotes = ['C0', 'C#0', 'D0', 'D#0', 'E0', 'F0', 'F#0', 'G0', 'G#0', 'A0', 'A#0', 'B0',
    'C1', 'C#1', 'D1', 'D#1', 'E1', 'F1', 'F#1', 'G1', 'G#1', 'A1', 'A#1', 'B1',
    'C2', 'C#2', 'D2', 'D#2', 'E2', 'F2', 'F#2', 'G2', 'G#2', 'A2', 'A#2', 'B2',
    'C3', 'C#3', 'D3', 'D#3', 'E3', 'F3', 'F#3', 'G3', 'G#3', 'A3', 'A#3', 'B3',
    'C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4', 'A4', 'A#4', 'B4',
    'C5', 'C#5', 'D5', 'D#5', 'E5', 'F5', 'F#5', 'G5', 'G#5', 'A5', 'A#5', 'B5',
    'C6', 'C#6', 'D6', 'D#6', 'E6', 'F6', 'F#6', 'G6', 'G#6', 'A6', 'A#6', 'B6',
    'C7', 'C#7', 'D7', 'D#7', 'E7', 'F7', 'F#7', 'G7', 'G#7', 'A7', 'A#7', 'B7',
    'C8'];

const notaMinimaSelect = document.getElementById('notaMinima');
const notaMaximaSelect = document.getElementById('notaMaxima');
const resultado = document.getElementById('resultado');
const combinacionesDiv = document.getElementById('combinaciones');


// Llenar los select con las notas disponibles
allPianoNotes.forEach((note, index) => {
    const optionMin = document.createElement('option');
    const optionMax = document.createElement('option');
    optionMin.value = index;
    optionMin.textContent = note;
    optionMax.value = index;
    optionMax.textContent = note;

    if (note === 'C3') {
        optionMin.selected = true;
    }
    if (note === 'C5') {
        optionMax.selected = true;
    }
    notaMinimaSelect.appendChild(optionMin);
    notaMaximaSelect.appendChild(optionMax);
});



const notasDual = {
    'F#/Gb': 'F#',
    'C#/Db': 'C#',
    'D#/Eb': 'D#',
    'G#/Ab': 'G#',
    'A#/Bb': 'A#'
};

// Función para normalizar las notas, teniendo en cuenta las notas con notación dual
function normalizarNotas(nota) {
    return notasDual[nota] || nota;
}


// Función para generar las combinaciones
function generarCombinaciones(rangoDisponible, conjuntoNotas) {
    const notasDisponibles = rangoDisponible.split(', ');

    // Función para agregar el número de octava a las notas
    function generarNotasConNumeros() {
        const combinaciones = [];
        for (let i = 1; i <= 7; i++) {
            const combinacion = conjuntoNotas.map(nota => `${nota}${i}`);
            combinaciones.push(combinacion);
        }
        return combinaciones;
    }

    // Filtrar combinaciones que estén dentro del rango disponible
    function filtrarCombinaciones(combinaciones) {
        return combinaciones.filter(combinacion =>
            combinacion.every(nota => notasDisponibles.includes(nota))
        );
    }

    // Generar las combinaciones con las notas y números de octava
    const combinaciones = generarNotasConNumeros();

    // Filtrar y devolver las combinaciones válidas
    return filtrarCombinaciones(combinaciones);
}

// Función para obtener las notas seleccionadas
function generarNotasSeleccionadas() {
    const notaMinima = parseInt(notaMinimaSelect.value, 10);
    const notaMaxima = parseInt(notaMaximaSelect.value, 10);
    if (notaMinima <= notaMaxima) {
        return allPianoNotes.slice(notaMinima, notaMaxima + 1);
    } else {
        return [];
    }
}





function filtrarNotas(rangoDisponible, conjunto) {
    const notasEquivalentes = {
        'C#': ['C#/Db'],
        'D#': ['D#/Eb'],
        F: ['F'],
        G: ['G'],
        A: ['A'],
        B: ['B'],
        C: ['C'],
        D: ['D'],
        E: ['E'],
        'F#': ['F#'],
        'G#': ['G#'],
        'A#': ['A#'],
    };

    const notasFiltradas = rangoDisponible.split(', ').filter((nota) => {
        const nombreNota = nota.replace(/[0-9]/g, '');
        // Comprobar si el nombreNota existe en notasEquivalentes
        if (notasEquivalentes[nombreNota]) {
            return conjunto.some((conjuntoNota) =>
                notasEquivalentes[nombreNota].includes(conjuntoNota)
            );
        }
        return false;  // Si no existe, se filtra la nota
    });

    return notasFiltradas;
}


function procesarRango(rango, conjunto) {
    // Paso 1: Identificar el índice de la primera coincidencia con conjunto[0]
    const primerElemento = conjunto[0];
    const indiceInicio = rango.findIndex((nota) => {
        const nombreNota = nota.replace(/\d/, ''); // Quitar la octava
        return nombreNota === primerElemento;
    });

    // Paso 2: Filtrar eliminando todo a la izquierda de la coincidencia inicial
    let rangoFiltrado =
        indiceInicio !== -1 ? rango.slice(indiceInicio) : rango;

    // Paso 3: Identificar el índice del último elemento que coincide con conjunto[conjunto.length - 1]
    const ultimoElemento = conjunto[conjunto.length - 1];
    const indiceFin = rangoFiltrado
        .map((nota) => nota.replace(/\d/, '')) // Quitar las octavas para comparación
        .lastIndexOf(ultimoElemento);

    // Paso 4: Filtrar eliminando todo a la derecha de la última coincidencia
    if (indiceFin !== -1) {
        rangoFiltrado = rangoFiltrado.slice(0, indiceFin + 1); // Incluye índice final
    }

    // Paso 5: Subdividir el rango filtrado en bloques consecutivos
    const bloques = [];
    for (let i = 0; i < rangoFiltrado.length; i += conjunto.length) {
        const subarray = rangoFiltrado.slice(i, i + conjunto.length);
        if (subarray.length === conjunto.length) {
            bloques.push(subarray);
        }
    }

    return bloques
}



function aplicarFiltrarNotas(rangoDisponible, conjuntos) {
    return conjuntos.map((conjunto) => filtrarNotas(rangoDisponible, conjunto));
}



function convertirNotas(notas) {
    return "'" + notas.join(', ') + "'";
}


function aplicarProcesarRango(A, B, procesarRango) {
    return A.map((a, index) => {

        return procesarRango(a, B[index]);
    });
}
let conjuntoDeRangos = []










let minBeats = 8;
let maxBeats = 8;
let loopActive = false; // Estado de bucle




function getRandomBeats(min, max) {
    return min === max ? min : Math.random() * (max - min) + min;
}

function playMelody(melody, index, bpm) {

    console.log(`Reproduciendo melodía ${index + 1}:`, melody.join(', '));

    const startTime = Tone.Transport.seconds;

    const timePerBeat = 15 / bpm;

    melody.forEach((note, i) => {
        Tone.Transport.schedule((time) => {
            piano.triggerAttackRelease(note, '8n', time + i * timePerBeat);
        }, startTime + i * timePerBeat);
    });
}

async function playMelodiesWithIntervals(
    melodies,
    minBeats,
    maxBeats,
    bpm
) {
    for (let i = 0; i < melodies.length; i++) {
        const melody = melodies[i];
        playMelody(melody, i, bpm);

        let intervalInSeconds;

        if (minBeats === maxBeats) {
            intervalInSeconds = minBeats * (15 / bpm);
            console.log(
                `Esperando ${minBeats} negras (${intervalInSeconds.toFixed(
                    2
                )} segundos) antes de la próxima melodía.`
            );
        } else {
            const randomBeats = getRandomBeats(minBeats, maxBeats);
            intervalInSeconds = randomBeats * (15 / bpm);
            console.log(
                `Esperando ${randomBeats.toFixed(
                    2
                )} negras (${intervalInSeconds.toFixed(
                    2
                )} segundos) antes de la próxima melodía.`
            );
        }

        await new Promise((resolve) =>
            setTimeout(resolve, intervalInSeconds * 1000)
        );
    }

    console.log('Se terminaron de reproducir todas las melodías.');

    // Si el bucle está activado, reinicia la reproducción
    if (loopActive) {
        playMelodiesWithIntervals(melodies, minBeats, maxBeats, bpm);
    }
}


function removeFirstLevel(nestedArray) {
    return nestedArray.flat(); // Aplana el primer nivel
}

function getRandomSubarrays(array, n) {
    if (n > array.length) {
        console.error("No se pueden seleccionar más arrays que los disponibles.");
        return [];
    }

    const shuffled = array.slice().sort(() => Math.random() - 0.5);
    return shuffled.slice(0, n);
}
function invertirElementos(array) {
    return array.map((subArray) => [...subArray].reverse()); // Usamos "spread" para copiar el sub-array
  }

  function mezclarArrays(array1, array2) {
    return [
      ...array1.map((subArray) => [...subArray]), // Copiamos cada sub-array de array1
      ...array2.map((subArray) => [...subArray].reverse()), // Copiamos y revertimos cada sub-array de array2
    ];
  }
let selectedArrays = []


function eliminarImpares(arr) {
    return arr.filter((_, index) => index % 2 === 0);
}
function aleatorizarOrden(array) {
    const copia = [...array]; // Copiamos el array original para no modificarlo
    for (let i = copia.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); // Índice aleatorio
      [copia[i], copia[j]] = [copia[j], copia[i]];  // Intercambiar elementos
    }
    return copia;
  }
  function processSelection() {
    // Inicializar variables y limpiar datos previos
    chunks = [];
    selectedTriads = [];
    const resultDiv = document.getElementById("result");

    // Configuración de triadas
    for (let i = 1; i <= rows; i++) {
        const normalTriad = document.querySelector(`#normal-triad-${i}`).checked;
        const sevenNote = document.querySelector(`#seven-note-${i}`).checked;

        const firstInversion = document.querySelector(`#first-inversion-${i}`).checked;
        const secondInversion = document.querySelector(`#second-inversion-${i}`).checked;
        const thirdInversion = document.querySelector(`#third-inversion-${i}`).checked;

        if (normalTriad || sevenNote) {
            if (normalTriad) {
                chunks.push(`"normal-triad-${i}"`);
                if (firstInversion) chunks.push(`"normal-triad-first-inversion-${i}"`);
                if (secondInversion) chunks.push(`"normal-triad-second-inversion-${i}"`);
                if (thirdInversion) chunks.push(`"normal-triad-third-inversion-${i}"`);
            }

            if (sevenNote) {
                chunks.push(`"seven-note-${i}"`);
                if (firstInversion) chunks.push(`"seven-note-first-inversion-${i}"`);
                if (secondInversion) chunks.push(`"seven-note-second-inversion-${i}"`);
                if (thirdInversion) chunks.push(`"seven-note-third-inversion-${i}"`);
            }
        }
    }

    chunksAuxiliar = chunks.map(chunk => chunk.replace(/['"]+/g, ''));
    console.log("Chunks procesados: ", chunksAuxiliar);

    // Generar triadas seleccionadas
    generateSelectedTriads(cyclicScaleSubset, chunksAuxiliar);
    console.log("Triadas generadas: ", selectedTriads);

    // Configurar rango de notas
    const rangoDisponible = convertirNotas(generarNotasSeleccionadas());
    conjuntoDeRangos = aplicarFiltrarNotas(rangoDisponible, selectedTriads);
    console.log("Conjunto de rangos: ", conjuntoDeRangos);

    // Procesar rango final
    const procesadoFinal = aplicarProcesarRango(conjuntoDeRangos, selectedTriads, procesarRango);
    console.log("Procesado final: ", procesadoFinal);

    // Configurar el tempo y beats
    const minBeats = parseFloat(document.getElementById("minBeats").value);
    const maxBeats = parseFloat(document.getElementById("maxBeats").value);
    const bpm = parseFloat(document.getElementById("bpm").value);
    Tone.Transport.bpm.value = bpm;

    console.log(`Configuración: Min Beats=${minBeats}, Max Beats=${maxBeats}, BPM=${bpm}`);

    // Selección de arrays
    const n = parseInt(document.getElementById("numArrays").value);
    const isAscChecked = document.getElementById("ascendente").checked;
    const isDescChecked = document.getElementById("descendente").checked;

    if (isNaN(n) || n <= 0) {
        resultDiv.textContent = "Por favor, introduce un número válido.";
        return;
    }

    if (isAscChecked && isDescChecked) {
        const array1 = getRandomSubarrays(removeFirstLevel(procesadoFinal), n);
        const array2 = invertirElementos(getRandomSubarrays(removeFirstLevel(procesadoFinal), n));
        const mezclados = array1.concat(array2);
        selectedArrays = aleatorizarOrden(eliminarImpares(mezclados));
        console.log("Arrays mezclados: ", selectedArrays);
    } else if (isAscChecked) {
        selectedArrays = getRandomSubarrays(removeFirstLevel(procesadoFinal), n);
    } else if (isDescChecked) {
        selectedArrays = invertirElementos(getRandomSubarrays(removeFirstLevel(procesadoFinal), n));
    } else {
        selectedArrays = [];
        resultDiv.textContent = "Por favor, selecciona al menos una opción.";
        return;
    }

    resultDiv.textContent = `Arrays seleccionados: ${JSON.stringify(selectedArrays)}`;
}

// Ejecutar al cargar el DOM
document.addEventListener("DOMContentLoaded", processSelection);

// Asociar al evento click del botón
document.getElementById("selectArraysButton").addEventListener("click", processSelection);




document.getElementById('play').addEventListener('click', async () => {
    console.clear();
    console.log('Iniciando reproducción...');
    const melodies = selectedArrays
    console.log("melodiasaplanadas", melodies)
    await Tone.start();
    Tone.Transport.start();
    playMelodiesWithIntervals(
        melodies,
        minBeats,
        maxBeats,
        Tone.Transport.bpm.value
    );

});


document.getElementById('loop').addEventListener('click', async () => {
    loopActive = !loopActive;
    const loopButton = document.getElementById('loop');
    const melodies = selectedArrays;

    if (loopActive) {
        if (Tone.Transport.state !== 'started') {
            console.log('Inicializando Tone.js para reproducción en bucle...');
            await Tone.start();
            Tone.Transport.start();
        }
        loopButton.textContent = 'Detener Bucle';
        console.log('Reproducción en bucle activada...');
        
        // Solo programa el transporte si no está en ejecución
        playMelodiesWithIntervals(
            melodies,
            minBeats,
            maxBeats,
            Tone.Transport.bpm.value
        );
    } else {
        loopButton.textContent = 'Reproducción en Bucle';
        console.log('Reproducción en bucle detenida...');
        Tone.Transport.stop();
        Tone.Transport.cancel(); // Detén y limpia eventos previos del transporte
    }
});

const durations = ['8n', '4n', '2n', '16n'];
function generateRandomRhythm() {
    const rhythm = [];
    const notesCopy = [...removeFirstLevel(selectedArrays)]; // Copia de las notas disponibles
    const totalNotes = notesCopy.length; // Total de notas originales

    while (rhythm.length < totalNotes) {
        const noteOrSilence = Math.random() < 0.45; // Probabilidad de silencio

        if (noteOrSilence && rhythm.length < totalNotes - notesCopy.length) {
            rhythm.push(null); // Agregar silencio
        } else if (notesCopy.length > 0) {
            const note = notesCopy.shift(); // Tomar la primera nota disponible
            const duration =
                durations[Math.floor(Math.random() * durations.length)];
            rhythm.push({ note, duration });
        }
    }

    const extraSilences = Math.floor(
        Math.random() * Math.ceil(totalNotes * 0.3)
    ); // Hasta un 30% más de silencios
    for (let i = 0; i < extraSilences; i++) {
        const randomIndex = Math.floor(Math.random() * rhythm.length); // Posición aleatoria
        rhythm.splice(randomIndex, 0, null); // Insertar un silencio
    }
    return rhythm;
}

let currentLoopId = null;

function playRhythm() {
    Tone.Transport.stop();
    Tone.Transport.cancel();

    if (currentLoopId !== null) {
        currentLoopId.dispose();
    }

    const rhythm = generateRandomRhythm();

    const combinacion = rhythm.map((item) => ({
        nota: item ? item.note : null,
        duracion: item ? item.duration : '4n',
    }));

    currentLoopId = new Tone.Loop((time) => {
        combinacion.forEach(({ nota, duracion }, i) => {
            if (nota) {
                // Ajustar el volumen dinámicamente en cada repetición
                const volumen = 0.2 + Math.random() * 1; // Rango dinámico de 0.5 a 1.5
                const durationInSeconds = Tone.Time(duracion).toSeconds();
                piano.triggerAttackRelease(
                    nota,
                    durationInSeconds,
                    time + i * durationInSeconds,
                    volumen
                );

                // Imprimir el volumen en la consola
                console.log(
                    `Nota: ${nota}, Volumen: ${volumen.toFixed(
                        2
                    )}, Duración: ${duracion}`
                );
            }
        });
    }, '1m');

    Tone.Transport.start();
    currentLoopId.start(0);

    console.log('Iniciando el loop...');
}

let isPlaying = false; // Variable de estado para rastrear si está reproduciendo
document.getElementById('dinamicPlay').addEventListener('click', () => {
    const playButton = document.getElementById('dinamicPlay'); // Referencia al botón

    if (!isPlaying) {
        console.log(generateRandomRhythm());
        playRhythm();
        console.log('Ritmo iniciado.');

        playButton.textContent = 'Stop'; // Cambiamos el texto del botón a "Stop"
        isPlaying = true;
    } else {
        // Detenemos el transporte
        Tone.Transport.stop(); 
        Tone.Transport.cancel(); 

        // Detenemos cualquier loop activo
        if (currentLoopId !== null) {
            currentLoopId.dispose();
            console.log('Loop detenido y limpiado.');
        }

        // Silenciamos todos los sonidos activos
        Tone.Destination.mute = true; // Silencia el destino principal

        // Si estás utilizando sintetizadores o reproductores, asegúrate de detenerlos manualmente

        // Reiniciar el muteo si es necesario
        setTimeout(() => {
            Tone.Destination.mute = false; // Reactiva el destino
        }, 100); // Opcional

        playButton.textContent = 'Play'; // Cambiamos el texto del botón a "Play"
        console.log('Todos los sonidos detenidos.');
        isPlaying = false;
    }
});

  // Código para abrir y cerrar el modal
  const modal = document.getElementById("myModal");
  const openModalBtn = document.getElementById("openModalBtn");

  openModalBtn.onclick = function() {
      modal.style.display = "block";
  }

  window.onclick = function(event) {
      if (event.target === modal) {
          modal.style.display = "none";
      }
  }



// Funcionalidad para mostrar/ocultar el div 'result' al hacer clic en el botón toggle
const toggleButton = document.getElementById('toggleResult');
const resultDiv = document.getElementById('result');

toggleButton.addEventListener('click', function() {
    // Cambiar el estado del div 'result'
    if (resultDiv.style.display === 'none') {
        resultDiv.style.display = 'block'; // Mostrar el div
        toggleButton.classList.add('active'); // Agregar la clase active para cambiar el estilo
        toggleButton.textContent = 'Ocultar'; // Cambiar el texto del botón
    } else {
        resultDiv.style.display = 'none'; // Ocultar el div
        toggleButton.classList.remove('active'); // Eliminar la clase active
        toggleButton.textContent = 'Mostrar'; // Cambiar el texto del botón
    }
});
