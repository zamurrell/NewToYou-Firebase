import React, { useEffect, useState } from "react";
import { StyleSheet, FlatList } from "react-native";

import listingsApi from "../api/listings";
import ActivityIndicator from "../components/ActivityIndicator";
import AppButton from "../components/AppButton";
import AppText from "../components/AppText";
import Screen from "../components/Screen";
import colors from "../config/colors";
import Card from "../components/Card";
import routes from "../navigation/routes";
import useApiFeed from "../hooks/useApiFeed";
import { firebase } from "../config/firebaseConfig";

function ListingsScreen({ navigation }) {
  const [refreshing, setRefreshing] = useState(false);
  // const { data: listings, error, loading, request: loadListings } = useApiFeed(
  //   listingsApi.getListings
  // );

  const [listings, setListings] = useState([]);

  const listingRef = firebase.firestore().collection("listings");

  // useEffect(() => {
  //   loadListings();
  // }, []);

  useEffect(() => {
    listingRef.onSnapshot(
      (querySnapshot) => {
        const newListings = [];
        querySnapshot.forEach((doc) => {
          const listing = doc.data();
          listing.id = doc.id;
          newListings.push(listing);
        });
        setListings(newListings);
      },
      (error) => {
        console.log(error);
      }
    );
  }, []);

  return (
    <>
      {/* <ActivityIndicator visible={loading} /> */}
      <Screen style={styles.screen}>
        {/* {error && (
          <>
            <AppText>Couldn't retrieve the listings.</AppText>
            <AppButton title="Retry" onPress={loadListings} />
          </>
        )} */}
        <FlatList
          data={listings}
          keyExtractor={(listing) => listing.id.toString()}
          renderItem={({ item }) => (
            <Card
              title={item.title}
              subTitle={"$" + item.price}
              imageUrl={item.photo[0]}
              onPress={() => navigation.navigate(routes.LISTING_DETAILS, item)}
              thumbnailUrl={item.photo[0]}
            />
          )}
          refreshing={refreshing}
          onRefresh={listingRef.onSnapshot(
            (querySnapshot) => {
              const newListings = [];
              querySnapshot.forEach((doc) => {
                const listing = doc.data();
                listing.id = doc.id;
                newListings.push(listing);
              });
              setListings(newListings);
            },
            (error) => {
              console.log(error);
            }
          )}
        />
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    padding: 20,
    backgroundColor: colors.lightGray,
    flex: 1,
  },
});

export default ListingsScreen;
