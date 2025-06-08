// Frecuencias de las notas musicales (en Hz) para cada octava
const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const A4 = 440; // Frecuencia de A4 (La central)
const A4_INDEX = 69; // Índice MIDI de A4

export interface Note {
  name: string;
  frequency: number;
  octave: number;
  cents: number;
}

// Función para encontrar la nota más cercana a una frecuencia dada
export function findClosestNote(samples: Float32Array, sampleRate: number): Note | null {
  try {
    // 1. Aplicar FFT (Transformada Rápida de Fourier) para encontrar la frecuencia fundamental
    const frequency = autoCorrelate(samples, sampleRate);
    
    if (frequency === -1) return null;
    
    // 2. Calcular el número de semitonos desde A4
    const noteNum = 12 * (Math.log2(frequency / A4));
    
    // 3. Redondear al semitono más cercano
    const roundedNoteNum = Math.round(noteNum);
    
    // 4. Calcular la diferencia en cents (100 cents = 1 semitono)
    const cents = Math.floor((noteNum - roundedNoteNum) * 100);
    
    // 5. Calcular el índice de la nota y la octava
    const index = (roundedNoteNum + A4_INDEX) % 12;
    const octave = Math.floor((roundedNoteNum + A4_INDEX) / 12);
    
    // 6. Obtener el nombre de la nota
    const noteName = NOTES[((index % 12) + 12) % 12];
    
    // 7. Calcular la frecuencia de la nota más cercana
    const noteFrequency = A4 * Math.pow(2, (roundedNoteNum) / 12);
    
    return {
      name: noteName,
      frequency: noteFrequency,
      octave,
      cents
    };
  } catch (error) {
    console.error('Error en findClosestNote:', error);
    return null;
  }
}

// Implementación del algoritmo de autocorrelación para encontrar la frecuencia fundamental
function autoCorrelate(buffer: Float32Array, sampleRate: number): number {
  // 1. Aplicar una ventana de Hann para reducir fugas espectrales
  applyHannWindow(buffer);
  
  // 2. Calcular la autocorrelación
  const n = buffer.length;
  const correlation = new Float32Array(n);
  
  for (let lag = 0; lag < n; lag++) {
    let sum = 0;
    for (let i = 0; i < n - lag; i++) {
      sum += buffer[i] * buffer[i + lag];
    }
    correlation[lag] = sum / (n - lag);
  }
  
  // 3. Encontrar el primer pico después del pico en 0
  let maxVal = -1;
  let maxPos = -1;
  const threshold = 0.2; // Umbral para considerar un pico
  
  for (let i = 1; i < n / 2; i++) {
    if (correlation[i] > maxVal) {
      maxVal = correlation[i];
      maxPos = i;
    } else if (correlation[i] > threshold * maxVal) {
      // Si encontramos un pico que supera el umbral, lo tomamos
      maxPos = i;
      break;
    }
  }
  
  // 4. Si no encontramos un pico válido, retornar -1
  if (maxPos === -1 || maxPos === 0) return -1;
  
  // 5. Interpolación cuadrática para mayor precisión
  const x1 = maxPos - 1;
  const x2 = maxPos;
  const x3 = maxPos + 1;
  const y1 = correlation[x1];
  const y2 = correlation[x2];
  const y3 = correlation[x3];
  
  const a = (y1 + y3 - 2 * y2) / 2;
  const b = (y3 - y1) / 2;
  const xPeak = -b / (2 * a);
  
  // 6. Calcular la frecuencia en Hz
  return sampleRate / xPeak;
}

// Aplicar ventana de Hann para reducir fugas espectrales
function applyHannWindow(buffer: Float32Array): void {
  const n = buffer.length;
  for (let i = 0; i < n; i++) {
    const multiplier = 0.5 * (1 - Math.cos((2 * Math.PI * i) / (n - 1)));
    buffer[i] *= multiplier;
  }
}
