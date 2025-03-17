import axios from 'axios';

export const getTiktokVideoById = async (videoUrl) => {
  let urlObj;

  if (videoUrl.includes('/@')) {
    urlObj = new URL(videoUrl);
  } else {
    const tiktokResponse = await axios.get(videoUrl);

    // urlObj = new URL(tiktokResponse.request.res.responseUrl);
    urlObj = new URL(tiktokResponse.request.responseURL);
  }

  const [_, userId, _1, postId] = urlObj.pathname.split('/');

  const response = await axios.get(
    // changed useast1a to useast2a due to first server not responding may occur same problem in the future
    `https://api16-normal-c-useast2a.tiktokv.com/aweme/v1/feed/?aweme_id=${postId}`,
  );

  const item = response.data.aweme_list[0];
  const coverVideo = item.video.download_addr.url_list[0];
  const cover = item.video.origin_cover.url_list[0];

  return {
    id: postId,
    cover,
    coverVideo,
    url: videoUrl,
    title: item.desc,
    description: item.author.nickname,
    type: 'SHORT_TIKTOK',
  };
};
