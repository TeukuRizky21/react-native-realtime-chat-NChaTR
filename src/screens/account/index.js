import React, {useState, useContext} from 'react';
import {StyleSheet, View, ImageBackground} from 'react-native';
import {
  Container,
  Content,
  Text,
  List,
  ListItem,
  Left,
  Body,
  Right,
  Icon,
} from 'native-base';
import sColor from '../../public/styles/color';
import color from '../../config/color';
import Header from '../../components/Header';
import {DangerModal} from '../../components/Modal';
import Loader from '../../components/Loader';
import {toastr, clearSession} from '../../helpers/script';
import AsyncStorage from '@react-native-community/async-storage';
import db, {firebase} from '../../config/firebase';
import RootContext from '../../context';

export default function Account({
  navigation: {
    navigate,
    push,
    state: {params},
  },
}) {
  const {dispatch} = useContext(RootContext);
  const [deleteModal, setDeleteModal] = useState(
    params ? params.delete : false,
  );
  const [config, setConfig] = useState({error: false, loading: false});
  const logout = () => {
    setConfig({loading: true, error: false});
    firebase
      .auth()
      .signOut()
      .then(() => {
        AsyncStorage.removeItem('loggedIn').then(() => {
          dispatch.reset(true);
          setConfig({loading: false, error: false});
          navigate('Login');
        });
      })
      .catch(() => {
        setConfig({loading: false, error: true});
        toastr('Ops, network error');
      });
  };
  const deleteAccount = () => {
    setDeleteModal(false);
    setConfig({loading: true, error: false});
    const user = firebase.auth().currentUser;
    user
      .delete()
      .then(() => {
        db.ref(`users/${user.displayName}`)
          .set(null)
          .then(() => {
            db.ref(`locations/${user.displayName}`)
              .set(null)
              .then(() => {
                db.ref(`friends/${user.displayName}`)
                  .set(null)
                  .then(() => {
                    clearSession(() => {
                      setConfig({loading: false, error: false});
                      toastr('Account successfully deleted.', 'success');
                      navigate('Login');
                    });
                  });
              });
          })
          .catch(() => {
            setConfig({loading: false, error: true});
            toastr('Ops, network error');
          });
      })
      .catch(() => {
        setConfig({loading: false, error: true});
        toastr("Please login again to verify it's you.");
        navigate('Login', {continue: 'Account'});
      });
  };
  return (
    <Container style={s.bg}>
      <DangerModal
        title="Delete Account"
        message="Are you sure to delete this account?"
        submitButtonText="Delete"
        visible={deleteModal}
        onClose={() => setDeleteModal(false)}
        onSubmit={deleteAccount}
      />
      <Header title="Account" />
      <Content>
        <List style={s.listContainer}>
          <ListItem itemDivider style={sColor.lightBgColor, s.bg}>
            <Text>Settings</Text>
          </ListItem>
          <ListArrow icon="contact" handlePress={() => push('Profile')}>
            Profile
          </ListArrow>
          <ListArrow icon="mail" handlePress={() => push('ChangeEmail')}>
            Email
          </ListArrow>
          <ListArrow icon="key" handlePress={() => push('ChangePassword')}>
            Password
          </ListArrow>
          <ListArrow
            icon="ios-close-circle"
            last
            style={sColor.dangerColor}
            handlePress={() => setDeleteModal(true)}>
            Delete Account
          </ListArrow>

          <ListItem itemDivider style={sColor.lightBgColor, s.bg}>
            <Text>Others</Text>
          </ListItem>
          <ListArrow icon="ios-help-circle">Help</ListArrow>
          <ListArrow icon="ios-information-circle" last>
            About
          </ListArrow>
          <ListArrow
            icon="log-out"
            last
            style={sColor.primaryColor}
            handlePress={logout}>
            Logout
          </ListArrow>
        </List>
      </Content>
      {config.loading && <Loader text="Please wait" />}
    </Container>
  );
}

Account.navigationOptions = {
  title: 'Account',
};

const s = StyleSheet.create({
  banner: {
    paddingVertical: 48,
  },
  imgContainer: {
    marginBottom: 20,
  },
  imgView: {position: 'relative', width: 75, height: 75},
  imgCircle: {borderRadius: 75 / 2},
  img: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  border: {
    borderColor: color.light,
    borderWidth: 2.5,
  },
  listContainer: {
    paddingVertical: 15,
  },
  list: {
    borderBottomWidth: 0.5,
    borderColor: color.paleGray,
  },
  py: {
    paddingVertical: 5,
  },
  bg: {
    backgroundColor: '#868482'
  }
});

const ListArrow = ({children, icon, style, last, handlePress}) => {
  return (
    <View style={[s.py, !last && s.list]}>
      <ListItem icon noBorder onPress={handlePress}>
        <Left>
          <Icon name={icon} style={style} />
        </Left>
        <Body>
          <Text style={style}>{children}</Text>
        </Body>
        {icon !== 'log-out' && (
          <Right>
            <Icon name="ios-arrow-forward" />
          </Right>
        )}
      </ListItem>
    </View>
  );
};
