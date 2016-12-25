import { StyleSheet } from 'react-native';
const SCREEN_WIDTH = require('Dimensions').get('window').width;

export const loadingStyle = StyleSheet.create({
  app: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
})

export const commonStyle = StyleSheet.create({
  error: {
    height: 40,
    width: 250,
    fontWeight: '100',
    textAlign: 'center',
    color: '#FF0000'
  },
  hidden: {
    height: 0,
    width: 0,
  },
})

export const loginStyles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#1D2F7B'
  },
  header: {
    textAlign: 'center',
    fontFamily: 'HelveticaNeue',
    fontSize: 40,
    color: 'white',
    fontWeight: '400',
    paddingTop: 80,
    paddingBottom: 45,
  },
  FBbtn: {
    alignSelf:'center',
    justifyContent: 'center',
    flexDirection: 'column',
    height: 48,
    width: 260,
    backgroundColor: 'white'
  },
  input: {
    height: 40,
    width: 270,
    fontWeight: '100',
    textAlign: 'center',
    color: '#FFFFFF'
  },
  form: {
    borderColor: 'white',
    borderBottomWidth: .5,
    marginBottom: 20
  },
  swipeBtn: {
    width: SCREEN_WIDTH,
    height: 50,
    borderColor: '#FFFFFF',
    backgroundColor: 'white',
    borderWidth: .5,
    justifyContent: 'center',
    position: 'absolute',
    bottom: 0
  },
  textMid:{
    fontSize: 15,
    marginTop: 20,
    marginBottom: 20,
    textAlign: 'center',
    color: '#FFFFFF',
    fontWeight: '700'
  },
  textSmall:{
    fontSize: 12,
    marginTop: 20,
    marginBottom: 20,
    textAlign: 'center',
    color: '#FFFFFF',
  },
  btnText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#1D2F7B'
  },
  disclamerText: {
    fontSize: 12,
    marginBottom: 0,
    textAlign: 'center',
    color: '#FFFFFF',
    marginBottom: 5,
    width: 300
  }
});

export const welcomeStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1D2F7B',
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    flexDirection: 'row'
  },
  logo: {
    fontFamily: 'HelveticaNeue',
    fontSize: 100,
    color: 'white',
    fontWeight: '700',
    letterSpacing: -2
  },
  messageText: {
    fontSize: 40,
    marginBottom: 0,
    textAlign: 'center',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  messageTextLight: {
    marginTop: 40,
    width: 220,
    fontSize: 18,
    marginBottom: 0,
    textAlign: 'center',
    color: '#bbbbbb',
    marginBottom: 5,
  },
  buttonTextInverted: {
    fontSize: 20,
    marginBottom: 0,
    textAlign: 'center',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  actionButtonInverted: {
   flex: 1,
   height: 50,
   justifyContent: 'center',
   alignItems: 'center',
   borderColor: '#FFFFFF',
   borderWidth: .5,
 },
 buttonText: {
   fontSize: 20,
   marginBottom: 0,
   textAlign: 'center',
   color: '#1D2F7B',
   marginBottom: 5,
 },
 actionButton: {
  flex: 1,
  height: 50,
  backgroundColor: '#FFFFFF',
  justifyContent: 'center',
  alignItems: 'center',
  borderColor: '#FFFFFF',
  borderWidth: .5,
 }
});
