import { StyleSheet } from 'react-native';

import Colors from './Colors';

const GlobalStyles = StyleSheet.create({
  bgScreen: {
    backgroundColor: Colors.bgcolor,
    flex: 1,
  },

  body: {
    flex: 1,
  },

  flexRowCenter: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },

  flexRowAlignCenter: {
    alignItems: 'center',
    flexDirection: 'row',
  },

  flexRowBetween: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },

  flexRowEvenly: {
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: 'row',
  },

  flexColumnCenter: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  textInput: {
    width: 300,
    height: 42,
    borderWidth: 1,
    borderColor: Colors.borderColor,
    borderRadius: 5,
    fontSize: 16,
    paddingLeft: 10,
    paddingRight: 10,
    color: Colors.white,
  }
});

export default GlobalStyles;

