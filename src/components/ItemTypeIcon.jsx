import React from 'react';

import MediaIcon from './MediaIcon';
import MixedIcon from './MixedIcon';
import MusicIcon from './MusicIcon';
import ShopIcon from './ShopIcon';
import ShortIcon from './ShortIcon';
import StreamIcon from './StreamIcon';
import SubBablIcon from './SubBablIcon';
import TextIcon from './TextIcon';
import VideoIcon from './VideoIcon';

const ICONS = {
  PHOTO: <MediaIcon width={15} height={(103 / 102) * 15} />,
  TEXT: <TextIcon width={15} height={(97 / 77) * 15} />,
  VIDEO: <VideoIcon width={15} height={(85 / 75) * 15} />,
  MUSIC: <MusicIcon width={15} height={(95 / 87) * 15} />,
  SHOP: <ShopIcon width={20} height={(107 / 104) * 20} />,
  SHORT: <ShortIcon width={20} height={(88 / 87) * 20} />,
  STREAM: <StreamIcon width={20} height={(108 / 81) * 20} />,
  MIXED: <MixedIcon width={15} height={(57 / 67) * 15} />,
  BABL: <SubBablIcon width={18} height={(34 / 34) * 18} />,
};

const ItemTypeIcon = ({ iconType }) => {
  return ICONS[iconType] || ICONS.MIXED;
};

export default ItemTypeIcon;
