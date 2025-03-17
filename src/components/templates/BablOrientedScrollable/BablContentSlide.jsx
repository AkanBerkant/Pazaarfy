import React, {useContext} from 'react';
import {FlatList, View, Dimensions, Image} from 'react-native';

import ChevronIcon from '../../../screens/EditBabl/ChevronIcon';
import Emitter from '../../../utils/emitter';
import {GridContext} from '../CustomGrid';

const PAGE_WIDTH = Dimensions.get('window').width;

const BablContentSlide = ({
  groupList,
  showPagination = false,
  marginRight = 24,
  pagingEnabled = false,
  size = 1,
}) => {
  const partSize = useContext(GridContext);
  const listRef = React.useRef();
  const animatedRef = React.useRef();
  const [selectedSlide, setSelectedSlide] = React.useState(0);

  React.useEffect(() => {
    const listener = Emitter.on('ON_UPDATE', payload => {
      animatedRef.current?.measure((x, y, width, height, pageX, pageY) => {
        const isInside =
          payload.x > pageX &&
          payload.y > pageY &&
          payload.x < pageX + width &&
          payload.y < pageY + height;

        if (isInside && payload.x > PAGE_WIDTH * 0.8) {
          listRef.current.scrollToIndex({
            animated: false,
            index: 1,
          });
        } else if (isInside && payload.x < PAGE_WIDTH * 0.2) {
          listRef.current.scrollToIndex({
            animated: false,
            index: 0,
          });
        }
      });
    });

    return () => {
      listener.remove();
    };
  }, []);

  const onViewableItemsChanged = React.useCallback(({viewableItems}) => {
    try {
      setSelectedSlide(viewableItems[0].index);
    } catch (error) {
      setSelectedSlide(0);
    }
  }, []);

  const viewabilityConfigCallbackPairs = React.useRef([
    {onViewableItemsChanged},
  ]);

  if (!groupList[0]) return null;

  return (
    <View
      ref={animatedRef}
      style={{
        height: partSize * size,
        width: Dimensions.get('window').width,
        justifyContent: 'center',
      }}>
      <FlatList
        ref={listRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled={pagingEnabled}
        viewabilityConfig={{viewAreaCoveragePercentThreshold: 50}}
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
        style={{
          overflow: 'hidden',
        }}
        data={groupList}
        renderItem={({item: groupItem}) => {
          return (
            <View
              style={{
                width: Dimensions.get('window').width,
                paddingRight: 24,
              }}>
              {groupItem}
            </View>
          );
        }}
      />

      {showPagination && (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            paddingVertical: 10,
          }}>
          {groupList.map((_, indx) => {
            return (
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 8,
                  backgroundColor:
                    selectedSlide === indx ? '#FFF' : '#a0a0a090',
                }}
              />
            );
          })}
        </View>
      )}

      {groupList.length > 1 && (
        <>
          <ChevronIcon
            width={24}
            height={24}
            color="rgba(255, 255, 255, 0.9)"
            style={{
              position: 'absolute',
              left: -9,
              zIndex: 2,
              shadowColor: 'black',
              shadowOffset: {width: 0, height: 2},
              shadowOpacity: 1,
              shadowRadius: 2,
              elevation: 2, // Sadece Android için gerekli
            }}
          />

          <ChevronIcon
            width={24}
            height={24}
            color="rgba(255, 255, 255, 0.9)"
            style={{
              position: 'absolute',
              right: 13,
              shadowOpacity: 3,
              shadowColor: 'black',
              shadowOffset: {width: 0, height: 2},
              shadowOpacity: 1,
              shadowRadius: 2,
              elevation: 2, // Sadece Android için gerekli
              zIndex: 2,
              transform: [
                {
                  rotateZ: '180deg',
                },
              ],
            }}
          />
        </>
      )}
    </View>
  );
};

export default BablContentSlide;
