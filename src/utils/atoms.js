import { Platform } from "react-native";

import { atom } from "jotai";
import { atomWithReset, atomWithStorage, createJSONStorage } from "jotai/utils";
import { getLocales } from "react-native-localize";

import Storage from "./storage";

export const getDeviceLang = () => {
  return getLocales()[0].languageTag.split("-")[0].toUpperCase();
};

export const userAtom = atomWithStorage(
  "user",
  null,
  createJSONStorage(() => {
    return Storage;
  }),
);

const isAndroid = Platform.OS === "android";

export const helpAtom = atomWithStorage(
  "help",
  {
    automaticBabl: isAndroid,
    bablEdit: isAndroid,
    bablFollow: isAndroid,
    interactiveBabl: isAndroid,
    scrollUp: isAndroid,
    shareLibrary: isAndroid,
    shareLibraryMore: isAndroid,
    tapToScreen: isAndroid,
    swipeUp: isAndroid,
  },
  createJSONStorage(() => {
    return Storage;
  }),
  {
    getOnInit: true,
  },
);

export const languageAtom = atomWithStorage(
  "language",
  getLocales()[0].languageTag.split("-")[0],
  createJSONStorage(() => {
    return Storage;
  }),
);

export const tabBarVisibleAtom = atom(true);

export const drawerAtom = atom(false);

export const splashAtom = atom(true);

export const autoBablAtom = atom(false);

export const bablFormAtom = atomWithReset({
  category: "ALL",
  items: {},
  hashtags: [],
  templateCategory: 0,
});

export const draftAtom = atomWithStorage(
  "draft",
  null,
  createJSONStorage(() => {
    return Storage;
  }),
);

export const chatsAtom = atom({});

export const unseenMessageCountAtom = atom((get) => {
  const chats = get(chatsAtom);

  return Object.values(chats).some((item) => {
    return item.unreadMessageCount > 0;
  });
});
