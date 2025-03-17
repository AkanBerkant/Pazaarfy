import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';

import { commonStyles, spacing } from '../../theme';

const Container = React.forwardRef(
  (
    {
      header,
      safearea = true,
      bottomSpace = false,
      scrollview = true,
      removeBottomEdge = false,
      showScrollIndicator = false,
      children,
      px = 0,
      dark,
      backgroundColor,
      py = 0,
      refreshControl,
      ...props
    },
    ref,
  ) => {
    const ViewComponent = safearea ? SafeAreaView : View;
    const ContentComponent = scrollview ? ScrollView : View;

    const contentStyle = {
      paddingHorizontal: typeof px === 'number' ? px : spacing[px],
      paddingVertical: typeof py === 'number' ? py : spacing[py],
    };

    const bottomSpaceStyle = {
      height: typeof bottomSpace === 'number' ? bottomSpace : 50,
    };

    const safeareEdges = ['left', 'right'];

    if (!removeBottomEdge) {
      safeareEdges.push('bottom');
    }
    if (!header) {
      safeareEdges.push('top');
    }

    return (
      <View
        style={[
          styles.root,
          {
            backgroundColor: backgroundColor || '#000',
          },
        ]}
      >
        {header}
        <ViewComponent
          edges={safeareEdges}
          {...props}
          style={[styles.container, props.containerStyle]}
        >
          <ContentComponent
            refreshControl={refreshControl}
            showsVerticalScrollIndicator={showScrollIndicator}
            contentContainerStyle={props.contentContainerStyle}
            style={[commonStyles.content, contentStyle, props.style]}
            onScroll={props.onScroll}
            bounces={false}
            ref={ref}
          >
            {children}
            {bottomSpace && scrollview && <View style={bottomSpaceStyle} />}
            {props.ListFooterComponent?.()}
          </ContentComponent>
        </ViewComponent>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  root: { flex: 1, position: 'relative' },
  container: {
    flex: 1,
  },
  space: {
    height: 50,
  },
});

export default Container;
