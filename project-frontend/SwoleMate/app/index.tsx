import { View, Text, TextInput, Pressable, StyleSheet, Image} from "react-native";
import { router } from "expo-router";

export default function LoginScreen() {
  return (

    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require("../assets/images/swolemate-icon.png")}
          style={styles.logo}
        />
      </View>

      <Text style={styles.title}>Login</Text>

      <TextInput
        placeholder="Email"
        style={styles.input}
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        style={styles.input}
      />

      <Pressable
        style={styles.button}
        onPress={() => router.replace("/(tabs)")}
      >
        <Text style={styles.buttonText}>
          Login
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    justifyContent: "center",
    padding: 30,
  },

  logoContainer: {
    width: 220,
    height: 220,
    backgroundColor: "#fff",

    justifyContent: "center",
    alignItems: "center",

    borderRadius: 110,
    alignSelf: "center",

    marginBottom: 30,
  },

  logo: {
    width: 200,
    height: 200,
    resizeMode: "contain",
  },

  title: {
    fontSize: 32,
    color: '#ff8c00',
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },

  button: {
    backgroundColor: "black",
    padding: 15,
    borderRadius: 10,
  },

  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 18,
  },
});