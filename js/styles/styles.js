import { StyleSheet } from 'react-native';

const centering = {
    alignItems: 'center',
    justifyContent: 'center'
};

const centeringContainer = {
  flex: 1,
  ...centering
};

const absoluteFullWidth = {
    position: 'absolute',
    left: 0,
    right: 0
};

const scrollContentContainer = {
  flex: 0,
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'flex-start',
};

export const FitlyBlue = '#1D2F7B';
const headerHight = 80;
const tabHeight = 70;
const selectedTabHeight = 80;
export const tabColor = 'rgba(61,61,61,.97)';
export const alternateBlue = '#326fd1';

export const loadingStyle = StyleSheet.create({
  app: {
    flex: 1,
    ...centering
  },
});

export const headerStyle = StyleSheet.create({
  header: {
    flex: 0,
    height: headerHight,
    backgroundColor: FitlyBlue,
  },
  inlineHeader: {
    alignSelf: 'stretch',
    flex: 0,
    height: headerHight,
    backgroundColor: FitlyBlue,
    top: 0,
    zIndex: 3,
    flexDirection: 'row',
    ...centering
  },
  container: {
    flex: 0,
    flexDirection: 'row',
    ...centering
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
  },
  text: {
    color: 'white',
    fontSize: 15
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
    ...absoluteFullWidth,
    bottom: 0,
    height: 80,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end"
  },
  tab: {
    backgroundColor: tabColor,
    height: tabHeight,
    flex:1,
    ...centering,
  },
  selectedTab: {
    backgroundColor: tabColor,
    borderTopRightRadius: 7,
    borderTopLeftRadius: 7,
    height: selectedTabHeight,
    flex:1,
    ...centering,
    shadowColor: "black",
    shadowOpacity: .3,
    shadowOffset: {width: 0, height: 0},
    shadowRadius: 2,
    zIndex: 10
  }
});

export const loginStyles = StyleSheet.create({
  container: {
    flex: 0,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: FitlyBlue
  },
  header: {
    textAlign: 'center',
    alignSelf: 'stretch',
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
    color: '#FFFFFF',
  },
  form: {
    borderColor: 'white',
    borderBottomWidth: .5,
    marginBottom: 20
  },
  swipeBtn: {
    alignSelf: 'stretch',
    height: 50,
    borderColor: '#FFFFFF',
    backgroundColor: 'white',
    justifyContent: 'center',
    bottom: 0,
    ...absoluteFullWidth,
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
    color: FitlyBlue
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
    ...centeringContainer,
    backgroundColor: FitlyBlue,
  },
  logoContainer: {
    ...centeringContainer,
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
   height: 50,
   ...centeringContainer,
   borderColor: '#FFFFFF',
   borderWidth: .5,
 },
 buttonText: {
   fontSize: 20,
   marginBottom: 0,
   textAlign: 'center',
   color: FitlyBlue,
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
export const composeStyle = StyleSheet.create({
  container: {
    ...centeringContainer,
  },
  scrollContentContainer: {
    ...scrollContentContainer,
  },
  input: {
    fontSize: 20,
    minHeight: 40,
    alignSelf: 'stretch',
    fontWeight: '100',
    textAlign: 'left',
    color: 'black',
    marginLeft: 20,
    marginRight: 20,
    // marginTop: 10,
  },
  inputBox: {
    flex: 0,
    paddingTop: 3,
    paddingBottom: 3,
    alignSelf: 'stretch',
    borderColor: '#ccc',
    borderTopWidth: .5,
  },
  photosSection: {
    flex: 0,
    alignSelf: "stretch",
    // borderWidth: 1,
    minHeight: 70,
    flexDirection: "row",
    justifyContent: "flex-start",
    flexWrap: "wrap",
    paddingLeft: 20,
    paddingRight: 20,
  },
  imgLarge: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    marginBottom: 5,
    backgroundColor: 'white',
    // alignItems: 'center',
    shadowColor: "black",
    shadowOpacity: .1,
    shadowOffset: {width: 0, height: 1},
    shadowRadius: 1,
  },
  closeBtn: {
    zIndex: 2,
    position: 'absolute',
    right: 20,
    top: 10,
    backgroundColor: 'rgba(0,0,0,0)',
  },
  photoThumbnail: {
    borderWidth: .5,
    borderColor: "#aaa",
    ...centering,
    height: 100,
    width: 100,
    marginLeft: 5,
    marginRight: 5,
    marginTop: 5,
    marginBottom: 5
  },
  category: {
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: .5,
    borderColor: FitlyBlue,
    width: 250,
    height: 50,
    borderRadius: 25,
    marginTop: 10,
    marginBottom: 10,
  },
  categoryText: {
    fontFamily: 'HelveticaNeue',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
    textAlign: 'center',
    color: FitlyBlue,
    fontSize: 20
  },
  profilePic: {
    // marginTop: 10,
    alignSelf: 'flex-start',
    borderRadius: 15,
    marginTop: 10,
    marginLeft: 20,
    marginBottom: 10,
    width: 30,
    height: 30,
    borderWidth: .5,
    borderColor: alternateBlue,
    justifyContent: 'center'
  },
  hashTagInput: {
    paddingLeft: 20,
    paddingRight: 20,
    flexDirection: 'row',
    flex: 0,
    justifyContent: 'flex-start',
    borderColor: '#ccc',
    borderBottomWidth: .5,
  },
  hashTag: {
    backgroundColor: 'rgba(255,255,255,0)',
    fontSize: 20,
    color: '#bbb',
    marginTop: 5,
    marginRight: 5
  }
});
export const profileStyle = StyleSheet.create({
  container: {
    flex: 0,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: 'white'
  },
  profileImg: {
    marginTop: 20,
    borderRadius: 50,
    width: 100,
    height: 100,
    borderWidth: 2,
    borderColor: alternateBlue,
    justifyContent: 'center'
  },
  dashboard: {
    flex:0,
    flexDirection: "row",
    justifyContent: "space-around",
    alignSelf: 'stretch',
    borderTopWidth: .5,
    borderBottomWidth: .5,
    paddingTop: 8,
    paddingBottom: 8,
    borderColor: "#ccc",
  },
  dashboardItem: {
    ...centering,
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
    color: alternateBlue,
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
    backgroundColor: FitlyBlue,
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

export const feedEntryStyle = StyleSheet.create({
  container: {
    flex: 0,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
    alignSelf: 'stretch',
    borderBottomWidth: .5,
    borderColor: '#ccc',
  },
  imgContainer: {
    flex: 0,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  images: {
    width: 71,
    height: 71,
  },
  imagesTouchable: {
    marginRight: 12,
    marginBottom: 12,
    width: 71,
    height: 71,
    borderWidth: .5,
    borderColor: "#ccc"
  },
  profileRow: {
    flex: 0,
    left: 0,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  username: {
    marginLeft: 10,
  },
  timestamp: {
    backgroundColor: 'rgba(255,255,255,0)',
    color: 'grey',
    fontSize: 10,
    right: 0,
    top: 10,
    position: 'absolute',
    right: 15,
  },
  smallDescription: {
    backgroundColor: 'rgba(255,255,255,0)',
    color: 'grey',
    fontSize: 9,
    left: 10,
    paddingBottom: 10,
    position: 'absolute'
  },
  description: {
    marginLeft: 10,
    fontSize: 10,
    color: 'grey',
  },
  profileImg: {
    borderRadius: 23,
    width: 46,
    height: 46,
    borderWidth: 1,
    borderColor: FitlyBlue,
    justifyContent: 'center'
  },
  photoFeedContainer: {
    marginTop: 1,
    flex:0,
    alignItems: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  photoFeedEntry: {
  }
});

export const postStyle = StyleSheet.create({
  scrollContentContainer: {
    ...scrollContentContainer,
  },
  postContainer: {
    alignSelf: 'stretch',
    marginTop: 20,
    borderBottomWidth: .5,
    borderColor: '#eee',
    paddingBottom: 15,
  },
  postContent: {
    marginLeft: 30,
    marginRight: 30,
  },
  imgContainer: {
    flex: 0,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  imagesTouchable: {
    marginRight: 10,
    marginBottom: 10,
    width: 80,
    height: 80,
    borderWidth: .5,
    borderColor: "#ccc"
  },
  images: {
    width: 80,
    height: 80,
  },
  title: {
    alignSelf: 'flex-start',
    fontSize: 16,
    fontWeight: "600",
    paddingBottom: 10
  },
  textContent: {
    fontSize: 13,
    paddingBottom: 20
  },
  socialBtns: {
    backgroundColor: 'rgba(255,255,255,0)',
    flexDirection: "row",
    justifyContent: "flex-end",
    alignSelf:'stretch',
  },
  iconText: {
    color: "grey",
    fontSize: 9,
    textAlign: "center"
  },
  socialIcon: {
    width: 40,
    // marginTop: 15,
    // paddingRight: 10,
    alignItems: 'center'
  },
  tagsRow: {
    flex: 0,
    marginTop: 10,
    flexDirection: "row",
    flexWrap: "wrap"
  },
  tags: {
    fontSize: 13,
    color: "grey",
    paddingRight: 10
  },
  comment: {

  },
  inputBar: {
    flex: 0,
    backgroundColor: '#eee',
    borderWidth: .5,
    borderColor: '#ddd',
    ...absoluteFullWidth,
    bottom: 0,
    justifyContent: 'center'
  },
  replyInput: {
    paddingLeft: 10,
    paddingTop: 2,
    marginTop: 7,
    marginBottom: 7,
    alignSelf: 'stretch',
    fontWeight: '100',
    textAlign: 'left',
    color: 'black',
    marginLeft: 20,
    marginRight: 60,
    borderWidth: .5,
    borderColor: '#ddd',
    borderRadius: 4,
    fontSize: 16,
    backgroundColor: 'white'
  },
  cameraBtn: {
    position: 'absolute',
    right: 16,
    top: 6
  },
})
