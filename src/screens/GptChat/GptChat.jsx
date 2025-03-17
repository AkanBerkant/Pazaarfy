import React, { useEffect, useRef, useState } from 'react';
import {
  FlatList,
  Image,
  Keyboard,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import {
  Canvas, LinearGradient, Rect, vec,
} from '@shopify/react-native-skia';
import { useMutation } from '@tanstack/react-query';
import { t } from 'i18next';
import { useAtomValue } from 'jotai';
import Lottie from 'lottie-react-native';
import { useDerivedValue, useSharedValue, withTiming } from 'react-native-reanimated';

import routes from '../../constants/routes';
import { sizes } from '../../theme';
import fonts from '../../theme/fonts';
import { userAtom } from '../../utils/atoms';
import * as Queries from '../../utils/queries';
import { getRandomColor } from '../utils';

import Message from './Message';

const GptChat = () => {
  const [text, setText] = React.useState('');
  const user = useAtomValue(userAtom);

  const { width, height } = useWindowDimensions();

  const leftColor = useSharedValue('red');
  const rightColor = useSharedValue('blue');

  const colors = useDerivedValue(() => {
    return [leftColor.value, rightColor.value];
  }, []);

  const [messages, setMessages] = useState([
    {
      _id: 1,
      text: `Hi ${user.username}, ${t('howtoday')}`,
      createdAt: new Date(),
      user: {
        _id: 2,
        name: 'BABL AI',
        avatar: require('../../assets/ai.png'),
      },
    },
  ]);

  const [messageCordinates, setMessageCordinates] = useState({ x: 0, y: 0 });
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isSender, setSender] = useState(false);

  const sendMessageMutation = useMutation(Queries.chatAi, {
    onMutate: (vars) => {
      setMessages((prev) => {
        return [...prev, vars];
      });
      setText('');
    },
    onSuccess: (res) => {
      setMessages((previousMessages) => {
        return [
          ...previousMessages,
          {
            ...res,
            user: {
              _id: 2,
              name: 'BABL AI',
              avatar: require('../../assets/ai.png'),
            },
          },
        ];
      });
    },
    onError: (err) => {
      console.log('err', err);

      notify({
        title: t('AnUnexpectedErrorOccurred'),
      });
    },
  });

  const navigation = useNavigation();
  const flatListRef = useRef(null);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
      // Klavye gösterildiğinde listenin en altına kaydır
      flatListRef.current.scrollToEnd({ animated: true });
    });

    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {sendMessageMutation?.isLoading && (
        <Lottie
          source={require('../../assets/load.json')}
          style={{
            ...StyleSheet.absoluteFillObject,
            backgroundColor: '#FFF',
            justifyContent: 'center',
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            alignItems: 'center',
            position: 'absolute',
            zIndex: 99,
          }}
          autoPlay
        />
      )}
      <Canvas style={{ flex: 1 }}>
        <Rect x={0} y={0} width={width} height={height}>
          <LinearGradient start={vec(0, 0)} end={vec(width, height)} colors={colors} />
        </Rect>
      </Canvas>

      <TouchableOpacity
        style={styles.backButtonContainer}
        onPress={() => {
          navigation.navigate(routes.Home);
        }}
      >
        <Image
          style={styles.backIcon}
          resizeMode="contain"
          source={require('../../assets/back.png')}
        />
      </TouchableOpacity>

      <FlatList
        ref={flatListRef}
        data={messages}
        showsVerticalScrollIndicator={false}
        style={styles.flatlist}
        keyExtractor={(item) => {
          return item.createdAt;
        }}
        onContentSizeChange={() => {
          // İçerik boyutu değiştiğinde (eleman eklendiğinde), listenin en altına kaydır
          if (!isKeyboardVisible) {
            flatListRef.current.scrollToEnd({ animated: true });
          }
        }}
        renderItem={({ item }) => {
          return (
            <Message
              {...item}
              type="text"
              isSender={item.user._id === 1}
              onPressIn={setSender}
              load={sendMessageMutation?.isLoading}
            />
          );
        }}
      />

      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={() => {
          leftColor.value = withTiming(getRandomColor());
          rightColor.value = withTiming(getRandomColor());
        }}
      >
        <Image style={styles.icon} source={require('../../assets/random.png')} />
      </TouchableOpacity>
      <View
        style={[
          styles.positionInput,
          {
            bottom: isKeyboardVisible ? sizes.width / 1.1 : 100,
          },
        ]}
      >
        <View>
          <TextInput
            onSubmitEditing={() => {
              if (text.length) {
                sendMessageMutation.mutate({
                  _id: Math.random().toString(16).slice(2),
                  text,
                  createdAt: new Date(),
                  user: {
                    _id: 1,
                  },
                });
              }
            }}
            value={text}
            onChangeText={setText}
            returnKeyType="send"
            editable={!sendMessageMutation.isLoading}
            style={[styles.input]}
            placeholder={t('AskAnything')}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    position: 'absolute',
    bottom: 32,
    right: 22,
    height: 54,
    aspectRatio: 1,
    borderRadius: 40,
    backgroundColor: '#111',
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 30,
    height: 30,
    tintColor: '#FFF',
  },
  positionInput: {
    position: 'absolute',
    bottom: 100,
    backgroundColor: '#000',
    width: sizes.width / 1.1,
    alignSelf: 'center',
    height: 49,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
  },
  input: {
    fontFamily: fonts.avenir,
    fontWeight: 'bold',
    width: sizes.width / 1.1,
    alignSelf: 'center',
    color: '#FFF',
    padding: 10,
  },
  flatlist: {
    position: 'absolute',
    top: 100,
    alignSelf: 'center',
    height: sizes.width * 1.5,
  },
  backButtonContainer: {
    position: 'absolute',
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    height: 54,
    aspectRatio: 1,
    borderRadius: 40,
    top: 32,
    left: 22,
  },
  backIcon: {
    width: 20,
    height: 20,
    tintColor: '#FFF',
    marginRight: 2,
  },
});

export default GptChat;
