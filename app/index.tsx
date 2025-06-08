import { View, Text, StyleSheet, Platform, PermissionsAndroid } from "react-native";
import React, { useEffect, useState, useRef } from 'react';
import AudioRecord from 'react-native-audio-record';
import { findClosestNote, Note } from '@/src/utils/audioUtils';

declare const atob: (str: string) => string;

// Configuración de audio
const options = {
  sampleRate: 44100,  // Frecuencia de muestreo en Hz
  channels: 1,       // Mono
  bitsPerSample: 16, // Tamaño de muestra
  audioSource: 6,    // MIC
  wavFile: 'tuner_recording.wav',
};

export default function Index() {
  const [note, setNote] = useState<Note | null>(null);
  const [error, setError] = useState<string | null>(null);
  const isRecording = useRef(false);
  const SAMPLE_RATE = options.sampleRate;

  // Función para obtener el estilo del texto de los cents
  const getCentsStyle = (cents: number) => ({
    fontSize: 20,
    color: Math.abs(cents) < 5 ? '#4CAF50' : '#F44336',
  });

  // Función para verificar y solicitar permisos de audio en Android
  const requestAudioPermission = async (): Promise<boolean> => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'Permiso de micrófono',
            message: 'La aplicación necesita acceso al micrófono para funcionar',
            buttonNeutral: 'Preguntar después',
            buttonNegative: 'Cancelar',
            buttonPositive: 'Aceptar',
          },
        );
        
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          return true;
        } else {
          setError('El permiso del micrófono es necesario para usar el afinador');
          return false;
        }
      } catch (err) {
        console.error('Error al solicitar permiso:', err);
        return false;
      }
    }
    return true; // Para iOS u otras plataformas, manejamos los permisos de otra manera
  };

  // Inicializar el grabador de audio
  useEffect(() => {
    const setupAudio = async () => {
      try {
        // Verificar y solicitar permisos
        const hasPermission = await requestAudioPermission();
        
        if (!hasPermission) {
          return; // El mensaje de error ya fue establecido en requestAudioPermission
        }

        // Inicializar grabador
        AudioRecord.init(options);

        // Configurar manejador de datos de audio
        AudioRecord.on('data', (data: string) => {
          if (!isRecording.current) return;
          
          try {
            // Convertir datos de base64 a Float32Array usando atob nativo
            const binaryString = atob(data);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
              bytes[i] = binaryString.charCodeAt(i);
            }
            // Verificar que la longitud sea múltiplo de 4 para Float32Array
            const float32Length = Math.floor(bytes.length / 4) * 4;
            const samples = new Float32Array(bytes.buffer, 0, float32Length / 4);
            
            // Procesar muestras para encontrar la nota
            if (samples.length > 0) {
              const detectedNote = findClosestNote(samples, SAMPLE_RATE);
              if (detectedNote) {
                setNote(detectedNote);
              }
            }
          } catch (err) {
            console.error('Error al procesar audio:', err);
          }
        });

        // Iniciar grabación
        AudioRecord.start();
        isRecording.current = true;
      } catch (err) {
        console.error('Error al configurar el audio:', err);
        setError('Error al configurar el micrófono');
      }
    };

    setupAudio();

    // Limpieza al desmontar
    return () => {
      isRecording.current = false;
      AudioRecord.stop();
    };
  }, []);

  return (
    <View style={styles.container}>
      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <View style={styles.tunerContainer}>
          {note ? (
            <>
              <Text style={styles.noteName}>{note.name}</Text>
              <Text style={styles.frequency}>{note.frequency.toFixed(1)} Hz</Text>
              <Text style={styles.octave}>Octava: {note.octave}</Text>
              <Text style={getCentsStyle(note.cents)}>
                {note.cents > 0 ? `+${note.cents}` : note.cents} cents
              </Text>
            </>
          ) : (
            <Text style={styles.placeholder}>Toca una cuerda...</Text>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0e0e0e',
    padding: 20,
  },
  tunerContainer: {
    alignItems: 'center',
  },
  noteName: {
    fontSize: 100,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  frequency: {
    fontSize: 24,
    color: '#aaa',
    marginBottom: 10,
  },
  octave: {
    fontSize: 20,
    color: '#888',
    marginBottom: 5,
  },
  placeholder: {
    fontSize: 24,
    color: '#666',
  },
  error: {
    color: '#F44336',
    fontSize: 18,
    textAlign: 'center',
  },
});
