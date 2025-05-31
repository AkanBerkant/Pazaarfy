import { Linking } from "react-native";

import { t } from "i18next";

import routes from "../../../constants/routes";
import * as Queries from "../../../utils/queries";

export const categoryOptionsData = {
  BABL: (navigation, cb, userId, isChecked) => {
    return [
      /* {
      icon: require('../../../assets/createk.png'),
      title: 'Create',
      description: 'Select babl from here.',
      onPress: () => {},
    }, */
      {
        icon: require("../../../assets/se.png"),
        title: t("BablSearch"),
        type: "BABLS_SEARCH",
        description: t("SelectBablFromHere"),
        onPress: () => {
          navigation.navigate(routes.CustomList, {
            title: t("BablSearch"),
            queryKey: "CUSTOM_BABL_SEARCH",
            isChecked,
            queryFn: async (searchTerm) => {
              if (!(searchTerm.length > 1)) return [];

              const d = await Queries.searchBabls(`search=${searchTerm}`);

              return (
                d?.babls?.map((item) => {
                  return { ...item, coverCopy: item.cover };
                }) || []
              );
            },
            type: "BABLS_SEARCH",
            cb,
          });
        },
      },
      {
        icon: require("../../../assets/fav.png"),
        title: t("FollowedBabls"),
        type: "BABLS_I_FOLLOW",
        description: t("SelectBablFromHere"),
        onPress: () => {
          navigation.navigate(routes.CustomList, {
            title: t("FollowedBabls"),
            queryKey: "CUSTOM_BABLS_I_FOLLOW",
            isChecked,
            queryFn: async (...params) => {
              const x = await Queries.getFollowingBabls(params);

              return x.map((item) => {
                return item.followingBabl;
              });
            },
            type: "BABLS_I_FOLLOW",
            cb,
          });
        },
      },
      {
        icon: require("../../../assets/rebad.png"),
        title: t("MyBabls"),
        type: "REBABLS",
        description: t("SelectBablFromHere"),
        onPress: () => {
          navigation.navigate(routes.CustomList, {
            title: t("MyBabls"),
            queryKey: "CUSTOM_REBABLS",
            isChecked,
            queryFn: Queries.getRebabls,
            type: "REBABLS",
            cb,
          });
        },
      },
      {
        icon: require("../../../assets/collectionda.png"),
        title: t("Collections"),
        description: t("SelectBablFromHere"),
        type: "COLLECTION_BABLS",
        onPress: () => {
          navigation.navigate(routes.CustomList, {
            title: t("CollectionBabls"),
            queryKey: "CUSTOM_COLLECTION_BABLS",
            isChecked,
            queryFn: () => {
              return Queries.getCollectionBabls(userId);
            },
            type: "COLLECTION_BABLS",
            cb,
          });
        },
      },
      {
        icon: require("../../../assets/lıked.png"),
        title: t("Likes"),
        type: "LIKED_BABLS",
        description: t("SelectBablFromHere"),
        onPress: () => {
          navigation.navigate(routes.CustomList, {
            title: t("Likes"),
            queryKey: "CUSTOM_LIKED_BABLS",
            isChecked,
            queryFn: () => {
              return Queries.getLikedBabls(userId);
            },
            type: "LIKED_BABLS",
            cb,
          });
        },
      },
      {
        icon: require("../../../assets/saveda.png"),
        title: t("Saved"),
        type: "SAVED",
        description: t("SelectBablFromHere"),
        isChecked,
        onPress: () => {
          navigation.navigate(routes.CustomList, {
            title: t("Saved"),
            queryKey: "CUSTOM_SAVED",
            isChecked,
            queryFn: Queries.listBookmarkedBabls,
            type: "SAVED",
            cb,
          });
        },
      },
    ];
  },
  PHOTO: () => {
    return [
      {
        icon: require("../../../assets/instagram.png"),
        title: "Instagram",
        description: t("TapToGoToSiteForShareContentToSharedSavings"),
        onPress: () => {
          return Linking.openURL("https://www.instagram.com/");
        },
      },
      {
        icon: require("../../../assets/pinterest.png"),
        title: "Pinterest",
        description: t("TapToGoToSiteForShareContentToSharedSavings"),
        onPress: () => {
          return Linking.openURL("https://pinterest.com/");
        },
      },
      {
        icon: require("../../../assets/google.png"),
        title: "Google",
        description: t("TapToGoToSiteForShareContentToSharedSavings"),
        onPress: () => {
          return Linking.openURL("https://bard.google.com/");
        },
      },
      {
        icon: require("../../../assets/beh.png"),
        title: "Behance",
        description: t("TapToGoToSiteForShareContentToSharedSavings"),
        onPress: () => {
          return Linking.openURL("https://www.behance.net/");
        },
      },
      {
        icon: require("../../../assets/flickr.png"),
        title: "Flickr",
        description: t("TapToGoToSiteForShareContentToSharedSavings"),
        onPress: () => {
          return Linking.openURL("https://www.flickr.com/");
        },
      },
      {
        icon: require("../../../assets/Mid.png"),
        title: "Midjourney",
        description: t("TapToGoToSiteForShareContentToSharedSavings"),
        onPress: () => {
          return Linking.openURL(
            "https://www.midjourney.com/home?callbackUrl=%2Fexplore",
          );
        },
      },
      {
        icon: require("../../../assets/StabiltyAI.png"),
        title: "Stabilty AI",
        description: t("TapToGoToSiteForShareContentToSharedSavings"),
        onPress: () => {
          return Linking.openURL("https://stability.ai/");
        },
      },
      {
        icon: require("../../../assets/buck.png"),
        title: "Photobucket",
        description: t("TapToGoToSiteForShareContentToSharedSavings"),
        onPress: () => {
          return Linking.openURL("https://photobucket.com/");
        },
      },
      {
        icon: require("../../../assets/davinci.png"),
        title: "Da Vinci",
        description: t("TapToGoToSiteForShareContentToSharedSavings"),
        onPress: () => {
          return Linking.openURL("https://davinci.ai/");
        },
      },
      {
        icon: require("../../../assets/jasper.png"),
        title: "Jasper",
        description: t("TapToGoToSiteForShareContentToSharedSavings"),
        onPress: () => {
          return Linking.openURL("https://www.jasper.ai/");
        },
      },
      /* {
      icon: require('../../../assets/instagram.png'),
      title: 'Instagram',
      description: 'Select photo from here.',
      queryFn: Queries.searchInstagram,
      type: 'PHOTO_INSTAGRAM'
    }, */

      // {
      //   icon: require('../../../assets/twitter.png'),
      //   title: 'Twitter',
      //   description: 'Tap to go to site for share content to "Shared Savings"',
      //   onPress: () => Linking.openURL('https://twitter.com/'),
      // },
    ];
  },
  TEXT: () => {
    return [
      {
        icon: require("../../../assets/twitter.png"),
        title: "Twitter",
        description: t("SelectTextFromHere"),
        queryFn: Queries.searchTwitter,
        type: "TEXT_TWITTER",
      },
      {
        icon: require("../../../assets/th.png"),
        title: "Threads",
        description: t("TapToGoToSiteForShareContentToSharedSavings"),
        onPress: () => {
          return Linking.openURL("https://www.threads.net/");
        },
      },
      {
        icon: require("../../../assets/google.png"),
        title: "Google",
        description: t("TapToGoToSiteForShareContentToSharedSavings"),
        onPress: () => {
          return Linking.openURL("https://www.google.com/");
        },
      },
      {
        icon: require("../../../assets/rddt.png"),
        title: "Reddit",
        description: t("TapToGoToSiteForShareContentToSharedSavings"),
        onPress: () => {
          return Linking.openURL("https://www.reddit.com/");
        },
      },

      {
        icon: require("../../../assets/sky.png"),
        title: "BlueSky",
        description: t("TapToGoToSiteForShareContentToSharedSavings"),
        onPress: () => {
          return Linking.openURL("https://bsky.app/");
        },
      },

      {
        icon: require("../../../assets/google.png"),
        title: "New Google Generative",
        description: t("TapToGoToSiteForShareContentToSharedSavings"),
        onPress: () => {
          return Linking.openURL("https://ai.google/");
        },
      },
    ];
  },
  VIDEO: () => {
    return [
      {
        icon: require("../../../assets/dailymotion.png"),
        title: "Dailymotion",
        description: t("SelectVideoFromHere"),
        queryFn: Queries.searchDailymotion,
        type: "VIDEO_DAILYMOTION",
      },
      {
        icon: require("../../../assets/vimeo.png"),
        title: "Vimeo",
        description: t("TapToGoToSiteForShareContentToSharedSavings"),
        onPress: () => {
          return Linking.openURL("https://vimeo.com/");
        },
      },
      {
        icon: require("../../../assets/rumble.png"),
        title: "Rumble",
        description: t("TapToGoToSiteForShareContentToSharedSavings"),
        onPress: () => {
          return Linking.openURL("https://rumble.com/");
        },
      },
      {
        icon: require("../../../assets/vidyard.png"),
        title: "Vidyard",
        description: t("TapToGoToSiteForShareContentToSharedSavings"),
        onPress: () => {
          return Linking.openURL("https://www.vidyard.com/");
        },
      },
      {
        icon: require("../../../assets/odysee.png"),
        title: "Odysee",
        description: t("TapToGoToSiteForShareContentToSharedSavings"),
        onPress: () => {
          return Linking.openURL("https://odysee.com/");
        },
      },
      {
        icon: require("../../../assets/dlive.png"),
        title: "Dlive TV",
        description: t("TapToGoToSiteForShareContentToSharedSavings"),
        onPress: () => {
          return Linking.openURL("https://dlive.tv/");
        },
      },
      {
        icon: require("../../../assets/schooltube.png"),
        title: "Schooltube",
        description: t("TapToGoToSiteForShareContentToSharedSavings"),
        onPress: () => {
          return Linking.openURL("https://www.schooltube.com/");
        },
      },
      {
        icon: require("../../../assets/dtube.jpeg"),
        title: "DTube",
        description: t("TapToGoToSiteForShareContentToSharedSavings"),
        onPress: () => {
          return Linking.openURL("https://d.tube/");
        },
      },
      {
        icon: require("../../../assets/godtube.png"),
        title: "Godtube",
        description: t("TapToGoToSiteForShareContentToSharedSavings"),
        onPress: () => {
          return Linking.openURL("https://www.godtube.com/");
        },
      },

      /* {
        icon: require('../../../assets/bing.png'),
        title: 'Bing',
        description: 'Select video from here.',
        queryFn: Queries.searchBing,
        type: 'VIDEO_BING',
      }, */
    ];
  },
  MUSIC: () => {
    return [
      {
        icon: require("../../../assets/spotify.png"),
        title: "Spotify",
        description: `${t("SelectMusic")} Spotify`,
        queryFn: Queries.searchSpotify,
        type: "MUSIC_SPOTIFY",
      },
      {
        icon: require("../../../assets/deezer.png"),
        title: "Deezer",
        description: `${t("SelectMusic")} Deezer`,

        queryFn: Queries.searchDeezer,
        type: "MUSIC_DEEZER",
      },
      {
        icon: require("../../../assets/apple-music.png"),
        title: "Apple",

        description: `${t("SelectMusic")} Apple`,
        queryFn: Queries.searchAppleMusic,
        type: "MUSIC_APPLE",
      },
      {
        icon: require("../../../assets/musicamazon.png"),
        title: "Amazon",
        description: t("TapToGoToSiteForShareContentToSharedSavings"),
        onPress: () => {
          return Linking.openURL();
        },
      },
      {
        icon: require("../../../assets/sound.png"),
        title: "SoundCloud",
        description: t("TapToGoToSiteForShareContentToSharedSavings"),
        onPress: () => {
          return Linking.openURL("https://soundcloud.com/");
        },
      },
      {
        icon: require("../../../assets/pandora.png"),
        title: "Pandora",
        description: t("TapToGoToSiteForShareContentToSharedSavings"),
        onPress: () => {
          return Linking.openURL("https://tr.pandora.net/");
        },
      },
      {
        icon: require("../../../assets/Quobuz.png"),
        title: "Quobuz",
        description: t("TapToGoToSiteForShareContentToSharedSavings"),
        onPress: () => {
          return Linking.openURL("https://www.qobuz.com/us-en/discover");
        },
      },
      {
        icon: require("../../../assets/iheart.png"),
        title: "ihearthRadio",
        description: t("TapToGoToSiteForShareContentToSharedSavings"),
        onPress: () => {
          return Linking.openURL("https://www.iheart.com/");
        },
      },
      // {
      //   icon: require('../../../assets/tidal.png'),
      //   title: 'Tidal',
      //   description: 'Tap to go to site for share content to "Shared Savings"',
      //   onPress: () => Linking.openURL('https://tidal.com/'),
      // },
      // {
      //   icon: require('../../../assets/Livexlive.png'),
      //   title: 'Livexlive',
      //   description: 'Tap to go to site for share content to "Shared Savings"',
      //   onPress: () => Linking.openURL('https://www.liveone.com/'),
      // },
    ];
  },
  SHOP: () => {
    return [
      {
        icon: require("../../../assets/amazon.png"),
        title: "Amazon",
        description: t("SelectProductFromHere"),
        queryFn: Queries.searchAmazon,
        type: "SHOP_AMAZON",
      },
      {
        icon: require("../../../assets/trendyol.png"),
        title: "Trendyol",
        description: t("TapToGoToSiteForShareContentToSharedSavings"),
        onPress: () => {
          return Linking.openURL("https://www.trendyol.com/");
        },
      },
      {
        icon: require("../../../assets/google-shopping.png"),
        title: "Google Shopping",
        description: t("SelectProductFromHere"),
        queryFn: Queries.searchGoogleShopping,
        type: "SHOP_GOOGLE_SHOPPING",
      },
      {
        icon: require("../../../assets/ebay.png"),
        title: "eBay",
        description: t("TapToGoToSiteForShareContentToSharedSavings"),
        onPress: () => {
          return Linking.openURL("https://www.ebay.com/");
        },
      },
      {
        icon: require("../../../assets/shopify.png"),
        title: "Shopify",
        description: t("TapToGoToSiteForShareContentToSharedSavings"),
        onPress: () => {
          return Linking.openURL("https://www.shopify.com/");
        },
      },
      {
        icon: require("../../../assets/baba.png"),
        title: "Alibaba Express",
        description: t("TapToGoToSiteForShareContentToSharedSavings"),
        onPress: () => {
          return Linking.openURL("https://tr.aliexpress.com/");
        },
      },
      {
        icon: require("../../../assets/Shein.png"),
        title: "Shein",
        description: t("TapToGoToSiteForShareContentToSharedSavings"),
        onPress: () => {
          return Linking.openURL(
            "https://asia.shein.com/?ref=www&rep=dir&ret=asia",
          );
        },
      },
      {
        icon: require("../../../assets/hb.png"),
        title: "Hepsiburada",
        description: t("TapToGoToSiteForShareContentToSharedSavings"),
        onPress: () => {
          return Linking.openURL("https://www.hepsiburada.com/");
        },
      },
      {
        icon: require("../../../assets/target.png"),
        title: "Target",
        description: t("TapToGoToSiteForShareContentToSharedSavings"),
        onPress: () => {
          return Linking.openURL(
            "https://www.target.com/c/shop-all-categories/-/N-5xsxf",
          );
        },
      },
      {
        icon: require("../../../assets/n11.png"),
        title: "N11",
        description: t("TapToGoToSiteForShareContentToSharedSavings"),
        onPress: () => {
          return Linking.openURL("https://www.n11.com/");
        },
      },
    ];
  },
  SHORT_VIDEO: () => {
    return [
      {
        icon: require("../../../assets/tiktok.png"),
        title: "Tiktok",
        description: t("SelectShortFromHere"),
        queryFn: Queries.searchTiktok,
        type: "SHORT_TIKTOK",
      },
      {
        icon: require("../../../assets/reels.png"),
        title: "Reels",
        description: t("TapToGoToSiteForShareContentToSharedSavings"),
        onPress: () => {
          return Linking.openURL("https://www.instagram.com/");
        },
      },

      {
        icon: require("../../../assets/snapchat.png"),
        title: "Snapchat Video",
        description: t("TapToGoToSiteForShareContentToSharedSavings"),
        onPress: () => {
          return Linking.openURL("https://www.snapchat.com/explore/video");
        },
      },
      {
        icon: require("../../../assets/vimeo.png"),
        title: "Vimeo",
        description: t("TapToGoToSiteForShareContentToSharedSavings"),
        onPress: () => {
          return Linking.openURL("https://vimeo.com/");
        },
      },
      {
        icon: require("../../../assets/triller.png"),
        title: "Triller",
        description: t("TapToGoToSiteForShareContentToSharedSavings"),
        onPress: () => {
          return Linking.openURL("https://triller.co/");
        },
      },

      {
        icon: require("../../../assets/like.png"),
        title: "Likee",
        description: t("TapToGoToSiteForShareContentToSharedSavings"),
        onPress: () => {
          return Linking.openURL("https://likee.video/");
        },
      },

      {
        icon: require("../../../assets/trell.png"),
        title: "Trell",
        description: t("TapToGoToSiteForShareContentToSharedSavings"),
        onPress: () => {
          return Linking.openURL("https://app.trell.me/");
        },
      },
    ];
  },
  STREAM: () => {
    return [
      {
        icon: require("../../../assets/twitch.png"),
        title: "Twitch",
        description: t("SelectStreamFromHere"),
        queryFn: Queries.searchTwitch,
        type: "STREAM_TWITCH",
      },
      {
        icon: require("../../../assets/tiktok.png"),
        title: "Tiktok Live",
        description: t("TapToGoToSiteForShareContentToSharedSavings"),
        onPress: () => {
          return Linking.openURL("https://www.tiktok.com/live");
        },
      },
      {
        icon: require("../../../assets/instagram.png"),
        title: "Instagram Live",
        description: t("TapToGoToSiteForShareContentToSharedSavings"),
        onPress: () => {
          return Linking.openURL("https://instagram.com/");
        },
      },

      {
        icon: require("../../../assets/BigoLive.png"),
        title: "Bigo Live",
        description: t("TapToGoToSiteForShareContentToSharedSavings"),
        onPress: () => {
          return Linking.openURL("https://www.bigo.tv/tr/");
        },
      },
      {
        icon: require("../../../assets/discord.png"),
        title: "Discord",
        description: t("TapToGoToSiteForShareContentToSharedSavings"),
        onPress: () => {
          return Linking.openURL("https://discord.com/");
        },
      },
      {
        icon: require("../../../assets/stlab.png"),
        title: "Streamlabs",
        description: t("TapToGoToSiteForShareContentToSharedSavings"),
        onPress: () => {
          return Linking.openURL("https://streamlabs.com/");
        },
      },
      {
        icon: require("../../../assets/riverside.png"),
        title: "Riverside",
        description: t("TapToGoToSiteForShareContentToSharedSavings"),
        onPress: () => {
          return Linking.openURL("https://riverside.fm/");
        },
      },

      {
        icon: require("../../../assets/podbear.png"),
        title: "Podbear",
        description: t("TapToGoToSiteForShareContentToSharedSavings"),
        onPress: () => {
          return Linking.openURL("https://www.podbean.com/user-a6Yj6CLPHj2");
        },
      },

      {
        icon: require("../../../assets/kick.png"),
        title: "KICK",
        description: t("TapToGoToSiteForShareContentToSharedSavings"),
        onPress: () => {
          return Linking.openURL("https://kick.com/");
        },
      },
    ];
  },
  INTERNET: () => {
    return [
      {
        icon: require("../../../assets/google.png"),
        title: "Google",
        description: t("TapToGoToSiteForShareContentToSharedSavings"),
        onPress: () => {
          return Linking.openURL("https://www.google.com");
        },
      },
      {
        icon: require("../../../assets/bing.png"),
        title: "Bing",
        description: t("SelectFromHere"),
        onPress: () => {
          return Linking.openURL("https://www.bing.com");
        },
      },
      {
        icon: require("../../../assets/mse.png"),
        title: "Microsoft Edge",
        description: t("TapToGoToSiteForShareContentToSharedSavings"),
        onPress: () => {
          return Linking.openURL(
            "https://www.microsoft.com/tr-tr/edge/download?form=MA13FJ",
          );
        },
      },
      {
        icon: require("../../../assets/opera.png"),
        title: "Opera",
        description: t("TapToGoToSiteForShareContentToSharedSavings"),
        onPress: () => {
          return Linking.openURL("https://www.opera.com/tr");
        },
      },
      {
        icon: require("../../../assets/Brave.png"),
        title: "Brave",
        description: t("TapToGoToSiteForShareContentToSharedSavings"),
        onPress: () => {
          return Linking.openURL("https://brave.com/");
        },
      },
      {
        icon: require("../../../assets/mozilla.jpeg"),
        title: "FireFox",
        description: t("TapToGoToSiteForShareContentToSharedSavings"),
        onPress: () => {
          return Linking.openURL("https://www.mozilla.org/tr/firefox/windows/");
        },
      },
    ];
  },
  AI: () => {
    return [
      {
        icon: require("../../../assets/gpt.png"),
        title: "Sora",
        description: t("TapToGoToSiteForShareContentToSharedSavings"),
        onPress: () => {
          return Linking.openURL("https://openai.com/sora");
        },
      },
      {
        icon: require("../../../assets/gemini.png"),
        title: "Gemini",
        description: t("TapToGoToSiteForShareContentToSharedSavings"),
        onPress: () => {
          return Linking.openURL("https://gemini.google.com/?hl=tr");
        },
      },
      {
        icon: require("../../../assets/gpt.png"),
        title: "Dall-e 2",
        description: t("TapToGoToSiteForShareContentToSharedSavings"),
        onPress: () => {
          return Linking.openURL("https://openai.com/dall-e-2");
        },
      },
      {
        icon: require("../../../assets/davinciai.png"),
        title: "Davinci",
        description: t("TapToGoToSiteForShareContentToSharedSavings"),
        onPress: () => {
          return Linking.openURL("https://davinci.ai/");
        },
      },
      {
        icon: require("../../../assets/canvai.png"),
        title: "Canva AI",
        description: t("TapToGoToSiteForShareContentToSharedSavings"),
        onPress: () => {
          return Linking.openURL("https://www.canva.com/ai-image-generator/");
        },
      },
      {
        icon: require("../../../assets/gpt.png"),
        title: "Chat GPT",
        description: t("SelectTextFromHere"),
        onPress: () => {
          return Linking.openURL("https://chat.openai.com/");
        },
      },
    ];
  },
};
