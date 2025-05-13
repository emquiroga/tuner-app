import { Text, View } from "react-native";
import Tuner from "@/src/components/tuner.tsx"

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "powderblue",
      }}
    >
      <Tuner />
    </View>
  );
}
