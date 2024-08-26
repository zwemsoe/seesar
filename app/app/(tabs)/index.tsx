import { StyleSheet, ScrollView } from "react-native";
import { HelloWave } from "~/components/HelloWave";
import { Text } from "~/components/ui/text";

export default function HomeScreen() {
  return (
    <ScrollView>
      <Text>Welcome!</Text>
      <HelloWave />
    </ScrollView>
  );
}

const styles = StyleSheet.create({});
