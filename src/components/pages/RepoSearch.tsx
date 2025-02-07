// src/components/RepoSearch.tsx

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchRepos,
  reset,
  incrementPage,
} from '../../redux/features/reposSlice';
import {
  Box,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  CardActions,
  FormControl,
  InputLabel,
  OutlinedInput,
  Button,
} from '@mui/material';
import { AppDispatch, Repo, ReposState } from '../../types/types';

const RepoSearch = () => {
  const dispatch: AppDispatch = useDispatch();
  const [username, setUsername] = useState<string>('');
  const [requestInProgress, setRequestInProgress] = useState<boolean>(false);

  const { repos, loading, error, page } = useSelector(
    (state: { repos: ReposState }) => state.repos
  );

  const handleSearch = (value: string) => {
    setUsername(value);
    dispatch(reset());
    setRequestInProgress(false);
    if (value) {
      dispatch(fetchRepos(value));
    }
  };

  const handleScroll = () => {
    const nearBottom =
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 100;
    if (nearBottom && !loading && !requestInProgress) {
      setRequestInProgress(true);
      dispatch(incrementPage());
    }
  };

  useEffect(() => {
    if (username && page > 1) {
      dispatch(fetchRepos(username)).then(() => {
        setRequestInProgress(false);
      });
    }
  }, [page, username, dispatch]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Box className="repo-search-container">
      <FormControl className="input-form" variant="outlined">
        <InputLabel>Имя пользователя</InputLabel>
        <OutlinedInput
          type="text"
          value={username}
          onChange={(e) => handleSearch(e.target.value)}
          label="Имя пользователя"
        />
      </FormControl>
      <Box className="err-counter">
        {error && (
          <Typography color="error" variant="body1">
            {error}
          </Typography>
        )}
      </Box>
      <Typography variant="body1">
        Счётчик репозиториев: {repos.length}
      </Typography>
      <Box className="repo-card-container">
        {repos.map((repo: Repo, index) => (
          <Card key={`${repo.id}-${index}`} className="repo-card">
            <CardContent>
              <Typography variant="h6">{repo.name}</Typography>
              <Typography color="textSecondary">
                Описание: {repo.description || 'Нет описания'}
              </Typography>
              <Typography variant="subtitle2">
                Звезды: {repo.stargazers_count}
              </Typography>
              <Typography variant="caption">
                Последнее обновление:{' '}
                {new Date(repo.updated_at).toLocaleDateString('ru-RU', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" href={repo.html_url} color="primary">
                Ссылка на репозиторий
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>
      {loading && <CircularProgress />}
    </Box>
  );
};

export default RepoSearch;
