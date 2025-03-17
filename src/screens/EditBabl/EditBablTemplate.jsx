import React from 'react';
import {
  Alert, Dimensions, StyleSheet, View,
} from 'react-native';

import { useMutation } from '@tanstack/react-query';
import { t } from 'i18next';
import { useAtomValue, useSetAtom } from 'jotai';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Animated, {
  measure,
  runOnJS,
  scrollTo,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import PercentLoader from '../../components/PercentLoader';
import { bablFormAtom, userAtom } from '../../utils/atoms';
import Emitter from '../../utils/emitter';
import * as Queries from '../../utils/queries';
import { splitArrayIntoChunks } from '../../utils/split-array';
import { BablUrlContext } from '../BablContent/BablContent';

import EditBablTags from './EditBablTags';
import { templateCategories } from './template-categories';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const AnimatedKeyboardAwareScrollView = Animated.createAnimatedComponent(KeyboardAwareScrollView);

const EditBablTemplate = ({
  templateCategory, title, items, randomTemplate, edited, showTrash,
}) => {
  const user = useAtomValue(userAtom);
  const scrollRef = useAnimatedRef();
  const scrollHandler = useScrollViewOffset(scrollRef);
  const selectedBox = useSharedValue(null);
  const offsetPosition = useSharedValue({ x: 0, y: 0 });
  const aPosition = useSharedValue({ x: 0, y: 0 });
  const bPosition = useSharedValue({ x: 0, y: 0 });
  const [scrollEnabled, setScrollEnabled] = React.useState(true);
  const setBablForm = useSetAtom(bablFormAtom);
  const [takenImg, setTakenImg] = React.useState();
  const [replaceImgs, setReplaceImgs] = React.useState();
  const hoveredBox = useSharedValue(null);
  const [currentHoveredBox, setCurrentHoveredBox] = React.useState();

  const addItemIntoSubBablMutation = useMutation(Queries.addItemIntoSubBabl);

  const offsetStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: selectedBox.value ? offsetPosition.value.x : 0,
        },
        {
          translateY: selectedBox.value ? offsetPosition.value.y : 0,
        },
      ],
      opacity: selectedBox.value ? 1 : 0,
    };
  });

  const aStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: aPosition.value.x,
        },
        {
          translateY: aPosition.value.y,
        },
      ],
      opacity: aPosition.value.x !== 0 ? 1 : 0,
    };
  });

  const bStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: bPosition.value.x,
        },
        {
          translateY: bPosition.value.y,
        },
      ],
      opacity: bPosition.value.x !== 0 ? 1 : 0,
    };
  });

  React.useEffect(() => {
    scrollRef.current?.scrollToPosition(0, 0, false);
  }, [randomTemplate]);

  const {
    template: SelectedTemplate,
    height: templateHeight,
    chunkSize = Infinity,
    shouldReverse = false,
  } = templateCategories?.[templateCategory]?.[randomTemplate] || templateCategories?.[0]?.[0];

  const chunks = splitArrayIntoChunks(items, chunkSize);

  const insideOfWhat = (event) => {
    'worklet';

    const found = items.find((item) => {
      if (!item.ref) return false;

      const position = measure(item.ref);

      if (!position) return false;

      return (
        event.absoluteX > position.pageX
        && event.absoluteY > position.pageY
        && event.absoluteX < position.pageX + position.width
        && event.absoluteY < position.pageY + position.height
      );
    });

    return found;
  };

  const replaceFn = (a, b) => {
    const typeB = items.find((item) => {
      return item.id === b;
    }).type;

    if (typeB === 'BABL_EMBED') {
      const itemA = items.find((item) => {
        return item.id === a;
      });

      addItemIntoSubBablMutation.mutate(
        { bablId: b, item: itemA },
        {
          onSuccess: () => {
            setBablForm((prev) => {
              const x = { ...prev };
              delete x.items[itemA.type][itemA.id];

              return x;
            });
          },
        },
      );
    } else {
      setBablForm((prev) => {
        const itemIds = items.map((a) => {
          return a.id;
        });
        const itemOrder = prev.itemOrder ? prev.itemOrder : itemIds;

        const itemA = itemOrder.indexOf(a);
        const itemB = itemOrder.indexOf(b);

        itemOrder[itemA] = b;
        itemOrder[itemB] = a;

        return {
          ...prev,
          itemOrder,
        };
      });
    }
  };

  const emitEvent = (payload) => {
    Emitter.emit('ON_UPDATE', payload);
  };

  React.useEffect(() => {
    if (currentHoveredBox) {
      const to = setTimeout(() => {
        hoveredBox.value = currentHoveredBox;
      }, 2 * 1000);

      return () => {
        clearTimeout(to);
      };
    }
  }, [currentHoveredBox]);

  const hoverItemUpdate = (event) => {
    'worklet';

    const found = insideOfWhat(event);

    if (found?.type === 'BABL_EMBED' && found.id !== selectedBox.value) {
      runOnJS(setCurrentHoveredBox)(found.id);
    } else {
      runOnJS(setCurrentHoveredBox)(null);
      hoveredBox.value = null;
    }
  };

  const pan = Gesture.Pan()
    // .activeOffsetX([-10, 10])
    .activateAfterLongPress(500)
    .onStart((event) => {
      const found = insideOfWhat(event);
      const parentPosition = measure(scrollRef).pageY;

      if (found) {
        const ax = items.find((item) => {
          return item.id === found.id;
        });
        offsetPosition.value = {
          x: event.absoluteX - 40,
          y: scrollHandler.value + event.absoluteY - 40 - parentPosition,
        };
        selectedBox.value = found.id;

        runOnJS(setScrollEnabled)(false);
        runOnJS(setTakenImg)(ax.coverCopy || ax.cover);
      }
    })
    .onUpdate((event) => {
      const parentPosition = measure(scrollRef).pageY;
      hoverItemUpdate(event);

      runOnJS(emitEvent)({ x: event.absoluteX, y: event.absoluteY });

      if (event.y + parentPosition > SCREEN_HEIGHT * 0.8) {
        scrollTo(scrollRef, 0, scrollHandler.value + 50, false);
      } else if (event.y < SCREEN_HEIGHT * 0.2) {
        scrollTo(scrollRef, 0, scrollHandler.value - 50, false);
      }

      offsetPosition.value = {
        x: event.absoluteX - 40,
        y: scrollHandler.value + event.absoluteY - 40 - parentPosition,
      };
    })
    .onFinalize((event) => {
      const parentPosition = measure(scrollRef).pageY;

      offsetPosition.value = {
        x: 0,
        y: 0,
      };
      runOnJS(setScrollEnabled)(true);

      if ([4, 5].includes(event.state)) {
        const a = selectedBox.value;
        const b = insideOfWhat(event)?.id;

        if (a && b) {
          const ax = items.find((item) => {
            return item.id === a;
          });
          const bx = items.find((item) => {
            return item.id === b;
          });

          const av = measure(ax.ref);
          const bv = measure(bx.ref);

          if (bx.type !== 'BABL_EMBED') {
            bPosition.value = {
              x: bv.pageX + bv.width / 2,
              y: scrollHandler.value + bv.pageY - parentPosition + bv.height / 2 - 40,
            };

            bPosition.value = withTiming(
              {
                x: av.pageX + av.width / 2 - 40,
                y: scrollHandler.value + av.pageY - parentPosition + av.height / 2 - 40,
              },
              {
                duration: 1000,
              },
            );
          }

          aPosition.value = {
            x: av.pageX + av.width / 2,
            y: scrollHandler.value + av.pageY - parentPosition + av.height / 2 - 40,
          };

          runOnJS(setReplaceImgs)([ax.coverCopy || ax.cover, bx.coverCopy || bx.cover]);

          aPosition.value = withTiming(
            {
              x: bv.pageX + bv.width / 2 - 40,
              y: scrollHandler.value + bv.pageY - parentPosition + bv.height / 2 - 40,
            },
            {
              duration: 1000,
            },
            () => {
              aPosition.value = {
                x: 0,
                y: 0,
              };
              bPosition.value = {
                x: 0,
                y: 0,
              };
              runOnJS(replaceFn)(a, b);
            },
          );
        }
      }

      runOnJS(setCurrentHoveredBox)(null);
      hoveredBox.value = null;
      selectedBox.value = null;
    });

  const removeItem = (target) => {
    Alert.alert(t('AreYouSureToDelete'), null, [
      {
        text: t('no'),
      },
      {
        text: t('yes'),
        onPress: () => {
          setBablForm((prev) => {
            const x = { ...prev };
            delete x.items[target.type][target.id];

            return x;
          });
        },
      },
    ]);
  };

  const chunkFlattened = chunks.reduce((prev, cur, curIndex) => {
    return [
      ...prev,
      ...(shouldReverse && curIndex % 2 === 1 ? cur.flat(Infinity).reverse() : cur.flat(Infinity)),
    ];
  }, []);

  return (
    <BablUrlContext.Provider
      value={{
        user,
        selectedBox,
        hoveredBox,
        items,
        chunkFlattened,
        removeItem: showTrash ? removeItem : null,
        title,
        templateHeight,
      }}
    >
      <GestureDetector gesture={pan}>
        <AnimatedKeyboardAwareScrollView ref={scrollRef} scrollEnabled={scrollEnabled}>
          {chunks.map((chunk, chunkIndex) => {
            const isReverseOrder = chunkIndex % 2 === 1 && shouldReverse;
            const items = isReverseOrder
              ? [...Array.from({ length: chunkSize - chunk.length }).fill(null), ...chunk]
              : chunk;

            return (
              <View
                style={{
                  marginBottom: 12,
                  paddingHorizontal: 12,
                }}
              >
                <SelectedTemplate items={items} isReverseOrder={isReverseOrder} />
              </View>
            );
          })}

          <EditBablTags edited={edited} />

          <Animated.Image
            source={{ uri: takenImg }}
            style={[
              {
                width: 80,
                height: 80,
                borderRadius: 8,
                position: 'absolute',
                top: 0,
                left: 0,
                zIndex: 9,
              },
              offsetStyles,
            ]}
          />

          <Animated.Image
            source={{ uri: replaceImgs?.[0] }}
            style={[
              {
                width: 80,
                height: 80,
                borderRadius: 8,
                backgroundColor: 'red',
                position: 'absolute',
                top: 0,
                left: 0,
                zIndex: 9,
              },
              aStyles,
            ]}
          />

          <Animated.Image
            source={{ uri: replaceImgs?.[1] }}
            style={[
              {
                width: 80,
                height: 80,
                borderRadius: 8,
                position: 'absolute',
                top: 0,
                left: 0,
                zIndex: 9,
              },
              bStyles,
            ]}
          />
        </AnimatedKeyboardAwareScrollView>
      </GestureDetector>

      <PercentLoader
        isLoading={addItemIntoSubBablMutation.isLoading}
        loadingPercent={0}
        showPercent={false}
      />
    </BablUrlContext.Provider>
  );
};

export default EditBablTemplate;

const styles = StyleSheet.create({});
