import { ChakraProvider, extendTheme, LightMode } from '@chakra-ui/react';
import { breakpoints } from './foundations/breakpoints';
import { colors } from './foundations/colors';
import { components } from './components';
import { fonts } from './foundations/fonts';
import { fontSizes } from './foundations/font-sizes';
import { sizes } from './foundations/sizes';
import { fx } from './foundations/fx';
import { headings } from './foundations/headings';
import { lineHeights } from './foundations/line-heights';

/**
 * Fonts
 */

const overrides = {
  ...fx,
  breakpoints,
  colors,
  components,
  config: {
    useSystemColorMode: false,
    initialColorMode: 'light'
  },
  fonts,
  fontSizes,
  lineHeights,
  sizes,
  styles: {
    global: {
      'html, body': {
        minHeight: 'full',
        height: 'auto'
      },
      body: {
        bg: 'brand2.100',
        color: 'gray.900',
        '*': {
          /* Only hide and show internal scrollbars (not the site scrollbar) */
          _hover: {
            '::-webkit-scrollbar': {
              display: 'block'
            }
          },
          '::-webkit-scrollbar': {
            display: 'none'
          }
        }
      },
      '.react-datepicker-popper': {
        zIndex: 9999
      },
      '.infinite-scroll-component': {
        pe: '0.625rem'
      },
      '::-webkit-scrollbar': {
        width: '0.4rem',
        height: '0.4rem',
        backgroundColor: 'transparent',
        borderRadius: '8px'
      },
      '::-webkit-scrollbar-thumb': {
        backgroundColor: '#959595',
        borderRadius: '8px',
        border: 'none'
      },
      '::-webkit-scrollbar-thumb:hover': {
        backgroundColor: '#999'
      },
      '::-webkit-scrollbar-track': {
        backgroundColor: 'transparent'
      },
      '::-webkit-scrollbar-button': {
        display: 'none'
      },
      '::-webkit-scrollbar-track-piece': {
        background: 'transparent'
      },
      ...headings
    }
  }
};

export function Theme({ children }: any) {
  const theme = extendTheme(overrides);

  return (
    <ChakraProvider theme={theme}>
      <LightMode>{children}</LightMode>
    </ChakraProvider>
  );
}
