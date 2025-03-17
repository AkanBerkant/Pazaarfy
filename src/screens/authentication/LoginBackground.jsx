import React from 'react';
import { TouchableOpacity, View } from 'react-native';

import { Tabs } from 'react-native-collapsible-tab-view';

import * as Queries from '../../utils/queries';
import HomeTab from '../tab/Home/HomeTab';

const LoginBackground = ({ toggleAnimation }) => {
  const [sampleFeed, setSampleFeed] = React.useState([]);

  React.useEffect(() => {
    Queries.getSampleFeed().then(setSampleFeed);
  }, []);

  const renderHeader = React.useCallback(() => {
    return null;
  }, []);

  const renderTabBar = React.useCallback(() => {
    return null;
  }, []);

  const onScroll = React.useCallback(() => {
    return null;
  }, []);

  const onRefresh = React.useCallback(() => {
    return null;
  }, []);

  if (!sampleFeed.length) return null;

  return (
    <Tabs.Container
      renderHeader={renderHeader}
      renderTabBar={renderTabBar}
    >
      <Tabs.Tab name="SampleFeed">
        <TouchableOpacity onPress={toggleAnimation}>
          <View pointerEvents="none">
            <HomeTab
              isFetching={false}
              tabName="SampleFeed"
              onRefresh={onRefresh}
              onScroll={onScroll}
              data={sampleFeed}
            />
          </View>
        </TouchableOpacity>
      </Tabs.Tab>
    </Tabs.Container>
  );
};

export default React.memo(LoginBackground);
