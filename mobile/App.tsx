import { StatusBar } from "expo-status-bar";
import MessagesScreen from "./screens/MessagesScreen";

export default function App() {
  return (
    <>
      <StatusBar style="dark" />
      <MessagesScreen />
    </>
  );
}
