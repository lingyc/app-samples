import { StyleSheet } from 'react-native';
const SCREEN_WIDTH = require('Dimensions').get('window').width;

export const loadingStyle = StyleSheet.create({
  app: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
});

export const headerStyle = StyleSheet.create({
  header: {
    height: 80,
    width: SCREEN_WIDTH,
    backgroundColor: '#1D2F7B',
    flex: 0,
  },
  container: {
    // borderWidth: 1,
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  logoText: {
    position: "absolute",
    paddingTop: 10,
    left: -30,
    fontFamily: 'HelveticaNeue',
    fontSize: 30,
    color: 'white',
    fontWeight: '700',
    letterSpacing: -1,
  },
  msgBtn: {
    position: "absolute",
    paddingTop: 15,
    right: 25,
  },
  settingsBtn: {
    position: "absolute",
    paddingTop: 16,
    right: -25,
  },
  titleText: {
    color: "white",
    paddingTop: 13,
    fontWeight: "600",
    fontSize: 20,
    textAlign: "center",
  },
  logoutBtn: {
    position: "absolute",
    paddingTop: 16,
    right: -25,
  },
  logoutBtnText: {
    fontWeight: "100",
    color: "white"
  },
  closeBtn: {
    paddingLeft: 20,
  }
});

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
  container: {
    flex: 1,
    alignItems: "center"
  }
});

export const tabStyle = StyleSheet.create({
  tabBar: {
    // flex: 0,
    // backgroundColor: "#3d3d3d",
    position: 'absolute',
    height: 80,
    bottom: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end"
  },
  tab: {
    backgroundColor: "#3d3d3d",
    height: 70,
    width: SCREEN_WIDTH / 5,
    justifyContent: 'center',
    alignItems: "center"
  },
  selectedTab: {
    backgroundColor: "#3d3d3d",
    borderTopRightRadius: 7,
    borderTopLeftRadius: 7,
    height: 80,
    width: SCREEN_WIDTH / 5,
    justifyContent: 'center',
    alignItems: "center",
    shadowColor: "black",
    shadowOpacity: .3,
    shadowOffset: {width: 0, height: 0},
    shadowRadius: 2,
    zIndex: 10
  }
});

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

export const profileStyle = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  profileImg: {
    marginTop: 20,
    borderRadius: 50,
    width: 100,
    height: 100,
    borderWidth: 2,
    borderColor: '#1D2F7B',
  },
  dashboard: {
    flex:0,
    flexDirection: "row",
    justifyContent: "space-around",
    width: SCREEN_WIDTH,
    borderTopWidth: .5,
    borderBottomWidth: .5,
    paddingTop: 8,
    paddingBottom: 8,
    borderColor: "#ccc",
  },
  dashboardItem: {
    justifyContent: "center",
    alignItems: "center",
  },
  centeredText: {
    textAlign: "center",
  },
  nameText: {
    fontSize: 26,
    paddingTop: 8,
    paddingBottom: 8
  },
  summaryText: {
    fontSize: 12,
    paddingBottom: 10
  },
  dashboardTextColor: {
    color: "#326fd1",
    fontSize: 20,
    paddingBottom: 10
  },
  dashboardText: {
    color: "grey",
    fontSize: 12,
    paddingBottom: 8
  },
  followBtn: {
    borderRadius: 2,
    backgroundColor: '#1D2F7B',
    width: 170,
    height: 40,
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 10,
    shadowColor: "black",
    shadowOpacity: .6,
    shadowOffset: {width: 0, height: 0},
    shadowRadius: 2,
  }
});
