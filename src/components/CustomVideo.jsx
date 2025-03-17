import React from 'react';

import Video from 'react-native-video';

const CustomVideo = ({
  shouldPlay = false,
  isLooping = false,
  useNativeControls = false,
  isMuted = true,
  ...props
}) => {
  const ref = React.useRef();

  React.useEffect(() => {
    return () => {
      ref.current?.unloadAsync?.();
    };
  }, []);

  return (
    <Video
      ref={ref}
      resizeMode="cover"
      {...props}
      repeat={isLooping}
      controls={useNativeControls}
      paused={!shouldPlay}
      muted={isMuted}
      disableFocus
      hideShutterView
      shutterColor="transparent"
    />
  );
};

export default CustomVideo;
