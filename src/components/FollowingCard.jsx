import React from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import HomeList from "../screens/tab/Home/HomeList";
import { sizes } from "../theme";
import fonts from "../theme/fonts";
import { userAtom } from "../utils/atoms";
import { useAtom } from "jotai";
import { useQuery } from "@tanstack/react-query";
import * as Queries from "../utils/queries";
const FolowingCard = ({ getAllData, categoryList, categoryIndex }) => {
  const [user, setUser] = useAtom(userAtom);

  const { data: userPostsData } = useQuery(
    [
      "getBablsQuery",
      {
        page: 1,
        limit: 10,
        user: categoryList.following._id,
      },
    ],
    () => {
      return Queries.getBablsQuery(
        new URLSearchParams({
          page: 1,
          limit: 10,
          user: categoryList.following._id,
        }),
      );
    },
    {
      placeholderData: {
        datas: [],
        totalPage: 0,
        totalCount: 0,
      },
    },
  );

  return (
    <View>
      {userPostsData?.datas?.length > 0 && (
        <>
          <Text
            style={{
              color: "#FFF",
              width: sizes.width / 1.07,
              alignSelf: "center",
              fontFamily: fonts.medium,
              marginTop: 10,
              marginBottom: 10,
            }}
          >
            {categoryList?.following?.username}
          </Text>

          <View
            key={`list_${categoryIndex}`}
            style={{
              width: sizes.width / 1.07,
              alignSelf: "center",
            }}
          >
            <HomeList
              getAllData={getAllData}
              data={userPostsData.datas}
              categoryIndex={categoryIndex}
              isReverse={categoryIndex % 2 === 0}
            />
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  innerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    color: "#333",
  },
});

export default FolowingCard;
