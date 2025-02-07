import RepoSearch from './components/pages/RepoSearch';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { Box, Typography } from '@mui/material';
import './components/styles/RepoSearchStyles.css';

function App() {
  return (
    <Provider store={store}>
      <Box className="app-container">
        <Typography className="typography">
          Поиск репозиториев GitHub
        </Typography>
        <RepoSearch />
      </Box>
    </Provider>
  );
}

export default App;
