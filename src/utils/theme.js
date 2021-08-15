import { createMuiTheme } from '@material-ui/core/styles';
import blueGrey from '@material-ui/core/colors/blueGrey';

import { THEME_COLORS } from './constants';

export const muiTheme = createMuiTheme({
  palette: {
    primary: {
      main: THEME_COLORS.PRIMARY,
    },
    secondary: {
      main: THEME_COLORS.SECONDARY,
    },
    background: {
      default: THEME_COLORS.BACKGROUND_COLOR,
    },
  },
  typography: {
    fontFamily: "'Poppins', sans-serif",
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 600,
  },
});

export const selectStyles = {
  container: provided => ({ ...provided, margin: '0', minWidth: '320px' }),
};

export const selectTheme = theme => ({
  ...theme,
  colors: {
    ...theme.colors,
    primary25: blueGrey[100],
    primary50: blueGrey[300],
    primary75: blueGrey[500],
    primary: blueGrey[700],
  },
});
