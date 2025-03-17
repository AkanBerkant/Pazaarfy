import React from 'react';
import {
  Image, StyleSheet, Text, TextInput, TouchableOpacity, View,
} from 'react-native';

import { t } from 'i18next';

import { Container } from '../../components';
import { sizes } from '../../theme';

const AddBabl = () => {
  const [bablStatus, setBablStatus] = React.useState(null);
  const [text, setText] = React.useState('');
  return (
    <Container>
      <View style={styles.header}>
        <Image source={require('../../assets/babl.png')} style={styles.babl} />
        <Image source={require('../../assets/close.png')} style={styles.close} />
      </View>
      {bablStatus ? (
        <>
          <View style={styles.box}>
            <Text style={styles.text}>{text}</Text>
            <TouchableOpacity
              onPress={() => {
                setBablStatus(false);
              }}
            >
              <Image style={styles.delete} source={require('../../assets/delete.png')} />
            </TouchableOpacity>
          </View>

          <Text style={styles.codeText}>
            {
              '<!DOCTYPE html><html lang="en"><head> <meta charset="UTF-8"> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <meta name="p:domain_verify" content="fdda3a988da750af54ad90466dd90119"/> <meta name="facebook-domain-verification" content="3oh58risl8zubokve93o200pvyihj0" /> <meta rel="prev" href="https://www.freepik.com/search?format=search&page=2&query=vr+museum&selection=1"> <meta rel="next" href="https://www.freepik.com/search?format=search&page=4&query=vr+museum&selection=1"> <link rel="icon" href="https://freepik.cdnpk.net/img/favicons/favicon.ico?v=2018082101" type="image/x-icon"/> <link rel="icon" type="image/png" href="https://freepik.cdnpk.net/img/favicons/favicon-32x32.png?v=2018082101" sizes="32x32"/> <link rel="icon" type="image/png" href="https://freepik.cdnpk.net/img/favicons/favicon-16x16.png?v=2018082101" sizes="16x16"/> <link href=\'https://freepik.cdnpk.net/img/favicons/favicon-96x96.png?v=2018082101\' rel=\'shortcut icon\' type=\'image/x-icon\'/> <link href=\'https://freepik.cdnpk.net/img/favicons/favicon-96x96.png?v=2018082101\' rel=\'icon\' type=\'image/x-icon\'/> <link rel="apple-touch-icon-precomposed" sizes="57x57" href="https://freepik.cdnpk.net/img/favicons/apple-icon-57x57.png?v=2018082101"/> <link rel="apple-touch-icon-precomposed" sizes="72x72" href="https://freepik.cdnpk.net/img/favicons/apple-icon-72x72.png?v=2018082101"/> <link rel="apple-touch-icon-precomposed" sizes="114x114" href="https://freepik.cdnpk.net/img/favicons/apple-icon-114x114.png?v=2018082101"/> <link rel="apple-touch-icon-precomposed" sizes="144x144" href="https://freepik.cdnpk.net/img/favicons/apple-icon-144x144.png?v=2018082101"/> <link rel="preconnect" href="https://img.freepik.com"> <link rel="preconnect" href="https://freepik.cdnpk.net"> <link rel="preconnect" href="https://freepik.cdnpk.net" crossorigin> <link rel="dns-prefetch" href="https://img.freepik.com"> <link rel="dns-prefetch" href="https://freepik.cdnpk.net"> <title>Vr Museum Vectors, Photos and PSD files | Free Download</title> <link rel=\'preload\' href=\'https://freepik.cdnpk.net/assets/proximanova-semibold-webfont.woff2\' as=\'font\' type=\'font/woff2\' crossorigin> <link rel=\'preload\' href=\'https://freepik.cdnpk.net/assets/proximanova-regular-webfont.woff2\' as=\'font\' type=\'font/woff2\' crossorigin> <link rel=\'preload\' href=\'https://freepik.cdnpk.net/assets/proximanova-bold-webfont.woff2\' as=\'font\' type=\'font/woff2\' crossorigin> <link rel=\'stylesheet\' type=\'text/css\' href=\'https://freepik.cdnpk.net/css/freepik.9f6d154945365b58473f.css\' > <link rel=\'stylesheet\' type=\'text/css\' href=\'https://freepik.cdnpk.net/css/main.839914b8c0f790e8b7da.css\' > <link rel=\'stylesheet\' type=\'text/css\' href=\'https://freepik.cdnpk.net/css/showcase.6e24dc581070a0687a56.css\' > <script>var gtmData = "{}";</script>'
            }
          </Text>
        </>
      ) : (
        <TextInput
          style={{
            marginLeft: 5,
            marginTop: 10,
          }}
          returnKeyType="done"
          value={bablStatus}
          onChangeText={(t) => {
            setText(t);
          }}
          onSubmitEditing={() => {
            setBablStatus(!bablStatus);
          }}
          placeholder={t('CreBabl')}
        />
      )}
    </Container>
  );
};

export default AddBabl;

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#FFF',
    shadowColor: '#EE558F',

    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    alignItems: 'center',
    alignSelf: 'center',
    width: sizes.width,
    elevation: 5,
    flexDirection: 'row',

    justifyContent: 'space-between',
    padding: 10,
  },
  babl: {
    width: 54,
    height: 54,
  },
  close: {
    width: 19,
    height: 19,
  },
  input: {
    width: sizes.width,
    height: sizes.height,
    padding: 10,
    margin: 10,
  },
  box: {
    backgroundColor: '#FFE7E7',
    width: sizes.width,
    height: 71,
    justifyContent: 'space-between',
    flexDirection: 'row',
    padding: 5,
    alignItems: 'center',
  },
  delete: {
    width: 45,
    height: 45,
  },
  text: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#000',
  },
  codeText: {
    margin: 5,
  },
});
