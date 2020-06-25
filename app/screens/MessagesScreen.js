import React, { useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";

import ListItemSeparator from "../components/lists/ListItemSeparator";
import ListItem from "../components/lists/ListItem";
import Screen from "../components/Screen";
import ListItemDeleteAction from "../components/lists/ListItemDeleteAction";

const initialMessages = [
  {
    id: 1,
    title: "Camera still available?",
    description: "I'm interested in the Nikon. Have you sold it yet?",
    image: require("../assets/headshot.jpeg"),
  },
  {
    id: 2,
    title: "Camera",
    description: "Could you do $280 for the Nikon D850?",
    image: require("../assets/headshot2.jpeg"),
  },
  {
    id: 3,
    title: "Gray Couch",
    description: "I could come pick it up Wednesday.",
    image: require("../assets/headshot3.jpeg"),
  },
  {
    id: 4,
    title: "Nikon",
    description: "I can't do $350.",
    image: require("../assets/headshot4.jpeg"),
  },
  {
    id: 5,
    title: "Lawnmower for sale",
    description: "You can come pick it up anytime, just text me first.",
    image: require("../assets/headshot5.jpeg"),
  },
];

function MessagesScreen(props) {
  const [messages, setMessages] = useState(initialMessages);
  const [refreshing, setRefreshing] = useState(false);

  const handleDelete = (message) => {
    setMessages(messages.filter((m) => m.id !== message.id));
  };

  return (
    <Screen>
      <FlatList
        data={messages}
        keyExtractor={(message) => message.id.toString()}
        renderItem={({ item }) => (
          <ListItem
            title={item.title}
            subTitle={item.description}
            image={item.image}
            onPress={() => console.log("Message Selected", item)}
            renderRightActions={() => (
              <ListItemDeleteAction onPress={() => handleDelete(item)} />
            )}
          />
        )}
        ItemSeparatorComponent={ListItemSeparator}
      />
    </Screen>
  );
}

export default MessagesScreen;

const styles = StyleSheet.create({});
