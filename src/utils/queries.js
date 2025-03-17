import instance from "./axios";
import { genereateSearchParams } from "./generate-search-params";

export const unseenNotificationCount = () => {
  return instance.get("/notification/unseen-count");
};

export const unseenMessageCount = () => {
  return 0;
};

export const uploadMedia = (media, onUploadProgress) => {
  const formData = new FormData();
  formData.append("file", {
    name: "file",
    type: media.mime,
    uri: media.path,
  });

  return instance.post("/media", formData, {
    onUploadProgress,
  });
};

export const uploadVideo = (media, onUploadProgress) => {
  const formData = new FormData();
  formData.append("file", {
    name: "file",
    type: media.mime,
    uri: media.path,
  });

  return instance.post("/video", formData, {
    onUploadProgress,
  });
};

export const sendFeedback = (dto) => {
  return instance.post("/user/feedback", dto);
};

export const loginViaGoogle = (dto) => {
  return instance.post("/auth/google", dto);
};

export const loginViaApple = (dto) => {
  return instance.post("/auth/apple", dto);
};

export const loginViaEmail = (dto) => {
  return instance.post("/auth/login", dto);
};

export const registerViaEmail = (dto) => {
  return instance.post("/auth/register", dto);
};

export const sendOtp = (dto) => {
  return instance.post("/auth/send-otp", dto);
};

export const verifyOtp = (dto) => {
  return instance.post("/auth/verify-otp", dto);
};

export const resetPassword = (dto) => {
  return instance.post("/auth/reset-password", dto);
};

export const searchResources = (dto = {}) => {
  const q = genereateSearchParams(dto);

  return instance.get(`/collection/resources${q}`);
};

export const searchResourcesPagination = (dto = {}) => {
  const q = genereateSearchParams(dto);

  return instance.get(`/collection/resources-pagination${q}`);
};

export const autoGenerate = (q) => {
  return instance.get(`/babl/auto-generate?q=${q}`, {
    timeout: 240 * 1000,
  });
};

export const chatAi = (dto) => {
  return instance.post("/babl/chat-ai", dto);
};

export const myGifts = () => {
  return instance.get("/babl/my-gifts");
};

export const sendGift = (dto) => {
  return instance.post("/babl/send-gift", dto);
};

export const sendCoin = (dto) => {
  return instance.post("/babl/send-coin", dto);
};

export const searchAppleMusic = (q) => {
  return instance.get(`/babl/apple-music?q=${q}`);
};

export const getAppleMusicById = (id) => {
  return instance.get(`/babl/apple-music/${id}`);
};

export const searchDeezer = (q) => {
  return instance.get(`/babl/deezer?q=${q}`);
};

export const getDeezerSongById = (id) => {
  return instance.get(`/babl/deezer/${id}`);
};

export const searchSpotify = (q) => {
  return instance.get(`/babl/spotify?q=${q}`);
};

export const getSpotifySongById = (id) => {
  return instance.get(`/babl/spotify/${id}`);
};

export const searchBing = (q) => {
  return instance.get(`/babl/bing?q=${q}`);
};

export const searchInstagram = (q) => {
  return instance.get(`/babl/instagram?q=${q}`);
};

export const getInstagramPostById = (postId) => {
  return instance.get(`/babl/instagram/${postId}`);
};

export const searchTiktok = (q) => {
  return instance.get(`/babl/tiktok?q=${q}`);
};

export const searchShorts = (q) => {
  return instance.get(`/babl/shorts?q=${q}`);
};

export const getTiktokVideoById = (userId, postId) => {
  return instance.get(`/babl/tiktok/${userId}/${postId}`);
};

export const searchAmazon = (q) => {
  return instance.get(`/babl/amazon?q=${q}`);
};

export const getAmazonProductByUrl = (url) => {
  return instance.post("/babl/amazon", { url });
};

export const searchGoogleShopping = (q) => {
  return instance.get(`/babl/google-shopping?q=${q}`);
};

export const getGoogleShoppingProductByUrl = (url) => {
  return instance.post("/babl/google-shopping", { url });
};

export const searchTwitter = (q) => {
  return instance.get(`/babl/twitter?q=${q}`);
};

export const getTwitterPostById = (userId, postId) => {
  return instance.get(`/babl/twitter/${userId}/${postId}`);
};

export const searchTwitch = (q) => {
  return instance.get(`/babl/twitch?q=${q}`);
};

export const getTwitchChannelById = (channelId) => {
  return instance.get(`/babl/twitch/${channelId}`);
};

export const searchYoutube = (q) => {
  return instance.get(`/babl/youtube?q=${q}`);
};

export const getYoutubeVideoById = (id) => {
  return instance.get(`/babl/youtube/${id}`);
};

export const searchDailymotion = (q) => {
  return instance.get(`/babl/dailymotion?q=${q}`);
};

export const getDailymotionVideoById = (videoId) => {
  return instance.get(`/babl/dailymotion/${videoId}`);
};

export const generateDalleImages = (q) => {
  return instance.get(`/babl/dalle?q=${q}`);
};

export const generateTextsWithChatgpt = (q) => {
  return instance.get(`/babl/chat-gpt?q=${q}`);
};

export const withdrawRequests = () => {
  return instance.get("/user/withdraw/requests");
};

export const createWithdrawRequest = (dto) => {
  return instance.post("/user/withdraw", dto);
};

export const blockUser = (dto) => {
  return instance.post("/user/block", dto);
};

export const unblockUser = (dto) => {
  return instance.post("/user/unblock", dto);
};

export const createReport = (dto) => {
  return instance.post("/user/report", dto);
};

export const convertGifts = () => {
  return instance.post("/user/convert-gifts");
};

export const convertCoins = (dto) => {
  return instance.post("/user/convert-coins", dto);
};

export const convertBalance = () => {
  return instance.post("/user/convert-balance");
};

export const getCurrentUser = () => {
  return instance.get("/user");
};

export const getUserById = (userId) => {
  return instance.get(`/user/${userId}`);
};

export const verifyUser = (dto) => {
  return instance.post("/user/verify", dto);
};

export const deleteAccount = () => {
  return instance.delete("/user");
};

export const updateProfile = (dto) => {
  return instance.patch("/user", dto);
};

export const sendAnalytics = (dto) => {
  return instance.post("/analytics", dto);
};

export const updateNotificationSettings = (dto) => {
  return instance.put("/user/notification-settings", dto);
};

export const updateKnownItems = (bablId) => {
  return instance.put(`/babl-follow/${bablId}/known-items`);
};

export const getFollowInfo = (userId) => {
  return instance.get(`/follow/${userId}/info`);
};

export const getBablFollowers = (bablId) => {
  return instance.get(`/babl-follow/${bablId}/babl-followers`);
};

export const getBablFollowInfo = (bablId) => {
  return instance.get(`/babl-follow/${bablId}/info`);
};

export const bablFollow = (bablId) => {
  return instance.post(`/babl-follow/${bablId}`);
};

export const bablUnfollow = (bablId) => {
  return instance.delete(`/babl-follow/${bablId}`);
};

export const createBabl = (dto) => {
  return instance.post("/babl", dto);
};

export const addItemIntoSubBabl = ({ bablId, item }) => {
  return instance.put(`/babl/${bablId}/add-item`, item);
};

export const createBablStory = (bablId) => {
  return instance.get(`/babl/${bablId}/story`);
};

export const deleteBabl = (bablId) => {
  return instance.delete(`/babl/${bablId}`);
};

export const getBabls = (userId) => {
  return instance.get(`/babl?user=${userId}&limit=999`);
};

export const getBablsPagination = (dto = {}) => {
  const q = genereateSearchParams(dto);

  return instance.get(`/babl/pagination${q}`);
};

export const pinBabl = (targetId) => {
  return instance.post(`/babl/${targetId}/pin`);
};

export const deletePin = (targetId) => {
  return instance.delete(`/babl/${targetId}/pin`);
};

export const unlockBabl = (bablId) => {
  return instance.get(`/babl/${bablId}/unlock`);
};

export const viewBabl = (bablId) => {
  return instance.post(`/babl/${bablId}/view`);
};

export const searchBabls = (query) => {
  return instance.get(`/babl/search?${query}`);
};

export const getBablById = (bablId) => {
  return instance.get(`/babl/${bablId}/detail`);
};

export const getBablCover = (bablId) => {
  return instance.get(`/babl/${bablId}/cover`);
};

export const listSendedBablRequests = () => {
  return instance.get("/babl/list-sended-requests");
};

export const listReceivedBablRequests = () => {
  return instance.get("/babl/list-received-requests");
};

export const getUnseenRequestCount = () => {
  return instance.get("/babl/count-new-requests");
};

export const approveRequest = (dto) => {
  return instance.post("/babl/approve-request", dto);
};

export const denyRequest = (dto) => {
  return instance.post("/babl/deny-request", dto);
};

export const sendRequest = (dto) => {
  return instance.post("/babl/send-request", dto);
};

export const getLikedBabls = (userId) => {
  return instance.get(`/babl/liked?user=${userId}`);
};

export const getRebabls = () => {
  return instance.get("/babl/rebabls");
};

export const getCollectionBabls = () => {
  return instance.get("/collection/find-all-items");
};

export const createCollection = (dto) => {
  return instance.post("/collection", dto);
};

export const deleteCollection = (collectionId) => {
  return instance.delete(`/collection/${collectionId}`);
};

export const updateCollection = (collectionId, dto) => {
  return instance.patch(`/collection/${collectionId}`, dto);
};

export const addItemIntoCollection = ({ collectionId, item }) => {
  return instance.patch(`/collection/${collectionId}/add-item`, { item });
};

export const parseMetadata = (url) => {
  return instance.post("/collection/parse-metadata", { url });
};

export const deleteResource = (dto) => {
  return instance.post("/collection/delete-resource", dto);
};

export const getCollections = () => {
  return instance.get("/collection");
};

export const getCollectionDetail = (id) => {
  return instance.get(`/collection/${id}`);
};

export const getSampleFeed = () => {
  return instance.get("/auth/sample-feed");
};

export const getForYouFeed = () => {
  return instance.get("/babl/for-you-feed");
};

export const getFollowingFeed = () => {
  return instance.get("/babl/following-feed");
};

export const getHotBablsOfDay = (region, categories) => {
  return instance.get(
    `/babl/hot/day?region=${region}&${categories
      .map((item) => {
        return `categories[]=${item}`;
      })
      .join("&")}`,
  );
};

export const getHotBablsOfWeek = (region, categories) => {
  return instance.get(
    `/babl/hot/week?region=${region}&${categories
      .map((item) => {
        return `categories[]=${item}`;
      })
      .join("&")}`,
  );
};

export const getHotBablsOfMonth = (region, categories) => {
  return instance.get(
    `/babl/hot/month?region=${region}&${categories
      .map((item) => {
        return `categories[]=${item}`;
      })
      .join("&")}`,
  );
};

export const getFollowingBabls = () => {
  return instance.get("/babl/followings");
};

export const getNotifications = () => {
  return instance.get("/notification");
};

export const setNotificationToken = (dto) => {
  return instance.patch("/notification/token", dto);
};

export const createComment = (dto) => {
  return instance.post("/comment", dto);
};

export const deleteComment = (commentId) => {
  return instance.delete(`/comment/${commentId}`);
};

export const getComments = (bablId) => {
  return instance.get(`/comment/${bablId}`);
};

export const createReply = (dto) => {
  return instance.post("/comment/reply", dto);
};

export const deleteReply = (replyId) => {
  return instance.delete(`/comment/reply/${replyId}`);
};

export const getReplies = (commentId) => {
  return instance.get(`/comment/${commentId}/reply`);
};

export const likeReply = (replyId) => {
  return instance.post(`/comment/reply/${replyId}/like`);
};

export const unlikeReply = (replyId) => {
  return instance.delete(`/comment/reply/${replyId}/unlike`);
};

export const follow = (userId) => {
  return instance.post(`/follow/${userId}`);
};

export const unfollow = (userId) => {
  return instance.delete(`/follow/${userId}`);
};

export const getFollowers = (userId) => {
  return instance.get(`/follow/${userId}/followers`);
};

export const getFollowings = (userId) => {
  return instance.get(`/follow/${userId}/followings`);
};

export const bookmarkBabl = (bablId) => {
  return instance.post(`/bookmark/${bablId}`);
};

export const deleteBookmarkBabl = (bablId) => {
  return instance.delete(`/bookmark/${bablId}`);
};

export const listBookmarkedBabls = () => {
  return instance.get("/bookmark/");
};

export const likeBabl = (bablId) => {
  return instance.post(`/like/${bablId}`);
};

export const unlikeBabl = (bablId) => {
  return instance.delete(`/like/${bablId}`);
};

export const likeComment = (commentId) => {
  return instance.post(`/comment/${commentId}/like`);
};

export const unlikeComment = (commentId) => {
  return instance.delete(`/comment/${commentId}/unlike`);
};

export const listLikes = (bablId) => {
  return instance.get(`/like/${bablId}`);
};

export const rebabl = (bablId) => {
  return instance.post(`/babl/${bablId}/repost`);
};

export const shareBabl = (bablId) => {
  return instance.post(`/babl/${bablId}/share`);
};

export const undoRebabl = (bablId) => {
  return instance.delete(`/babl/${bablId}/repost`);
};

export const sendMessage = (dto) => {
  return instance.post("/chat/message", dto);
};

export const buyCoin = (dto) => {
  return instance.post("/purchase", dto);
};
