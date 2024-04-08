import React, { useEffect } from "react";
import * as Font from "expo-font";
import AuthNavigation from "./src/navigation/AuthNavigation";

export default function App() {
  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        Montserrat: require("./assets/fonts/Montserrat-Regular.ttf"),
        MontserratBold: require("./assets/fonts/Montserrat-Bold.ttf"),
        TimesRoman: require("./assets/fonts/TimesRoman-Regular.ttf"),
        lexend: require("./assets/fonts/Lexend-Regular.ttf")
      });
    }
    loadFonts();
  }, []);
  return <AuthNavigation />

}

