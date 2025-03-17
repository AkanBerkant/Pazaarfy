import { StyleSheet } from 'react-native';

import { colors, textColors } from './colors';
import {
  textStyles,
  fontSize, height, radius, sizes, spacing,
} from './theme';

export const commonStyles = StyleSheet.create({
  content: {
    flex: 1,
  },
  checkbox: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    paddingHorizontal: 0,
    justifyContent: 'center',
  },
  inputContainer: {
    height: height.input,
    backgroundColor: colors.background,
    paddingHorizontal: 12,
    width: sizes.width / 1.1,
    borderRadius: radius.s,
    marginVertical: spacing.s,
  },
  input: {
    ...textStyles.textBase,
    fontSize: fontSize.medium - 2,
  },
  inputErrorText: {
    ...textStyles.textBase,
    fontSize: fontSize.xs,
    color: textColors.error,
    paddingHorizontal: 4,
  },
});
