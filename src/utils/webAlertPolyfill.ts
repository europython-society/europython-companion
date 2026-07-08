import { Alert, Platform } from "react-native";

if (Platform.OS === "web") {
  Alert.alert = (title, message, buttons) => {
    const list = buttons?.length ? buttons : [{ text: "OK" }];
    const cancelButton = list.find((b) => b.style === "cancel");
    const actionButton = list.find((b) => b !== cancelButton) ?? list[0];
    const text = [title, message].filter(Boolean).join("\n\n");

    if (list.length > 1) {
      if (window.confirm(text)) {
        actionButton?.onPress?.();
      } else {
        cancelButton?.onPress?.();
      }
    } else {
      window.alert(text);
      actionButton?.onPress?.();
    }
  };
}
