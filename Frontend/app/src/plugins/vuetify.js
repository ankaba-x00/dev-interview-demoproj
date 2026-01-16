import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles';
import { createVuetify } from 'vuetify';

export default createVuetify({
  theme: {
    defaultTheme: 'system',
    themes: {
      light: {
        dark: false,
        colors: {
          background: '#ebecf0',
          surface: '#f4f0f0',
          clr0: '#181919',
          clr1: '#226bdf',
          clr2: '#36ad68',
          clr3: '#d4a839',
          clr4: '#e5844f',
          error: '#d33434',
          success: '#22C55E',
        },
      },
      dark: {
        dark: true,
        colors: {
          background: '#0B1220',
          surface: '#111827',
          clr0: '#d9e7ef',
          clr1: '#3b81f2',
          clr2: '#4b9e6e',
          clr3: '#dcb85c',
          clr4: '#f6884d',
          error: '#F87171',
          success: '#4ADE80',
        },
      },
    },
  },
});
