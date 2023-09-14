import React from 'react';

const ThemeContext = React.createContext({ theme: 'day', toggleTheme: () => {} });

export default ThemeContext;
