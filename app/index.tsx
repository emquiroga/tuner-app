import { View } from "react-native";
import { useEffect } from 'react';
import AudioRecord from 'react-native-audio-record';
import Tuner from "@/src/components/tuner"


const options = {
  sampleRate: 44100,
  channels: 1,
  bitsPerSample: 16,
  audioSource: 6,
  wavFile: 'test.wav',
};

// AudioRecord.init(options);

export default function Index() {

    // useEffect(() => {
    //   AudioRecord.on('data', data => {
    //     // `data` is a base64-encoded string of PCM data
    //     const chunk = Buffer.from(data, 'base64');
    //     // Aquí puedes procesar con pitch detection
    //   });

    //   AudioRecord.start();
    // }, []);

    console.log(AudioRecord)
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: '#0e0e0e',

      }}
    >
      <Tuner />
    </View>
  );
}
