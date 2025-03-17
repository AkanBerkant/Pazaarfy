import React from 'react';
import { StyleSheet, View } from 'react-native';

import FastImage from 'react-native-fast-image';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const SkeletonImage = ({ uri, ImageComponent = FastImage, ...props }) => {
  const [layout, setLayout] = React.useState();
  const [loaded, setLoaded] = React.useState(false);

  if (!uri) {
    return null;
  }

  return <FastImage source={{ uri }} {...props} />;

  return (
    <View
      style={props.style}
      onLayout={(event) => {
        setLayout(event.nativeEvent.layout);
      }}
    >
      {layout && (
        <>
          {!loaded && (
            <SkeletonPlaceholder borderRadius={12}>
              <View style={layout} />
            </SkeletonPlaceholder>
          )}

          <ImageComponent
            resizeMode="cover"
            source={{
              uri,
            }}
            onLoadEnd={() => {
              setTimeout(() => {
                setLoaded(true);
              }, 1500);
            }}
            style={[
              props.style,
              {
                opacity: loaded ? 1 : 0,
              },
            ]}
            {...props}
          />
        </>
      )}
    </View>
  );
};

export default SkeletonImage;

const styles = StyleSheet.create({});
