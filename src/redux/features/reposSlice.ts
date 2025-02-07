import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Repo, ReposState } from '../../types/types';

const initialState: ReposState = {
  repos: [],
  loading: false,
  error: undefined,
  page: 1,
};

export const fetchRepos = createAsyncThunk<Repo[], string>(
  'repos/fetchRepos',
  async (username: string, { getState }) => {
    const { page } = (getState() as { repos: ReposState }).repos;
    const response = await axios.get<Repo[]>(
      `https://api.github.com/users/${username}/repos?page=${page}&per_page=20`,
      {
        headers: {
          Authorization: `${import.meta.env.GITHUB_ACCESSTOKEN}`,
        },
      }
    );
    return response.data;
  }
);

const reposSlice = createSlice({
  name: 'repos',
  initialState,
  reducers: {
    reset: (state) => {
      state.repos = [];
      state.page = 1;
      state.error = undefined;
    },
    incrementPage: (state) => {
      state.page += 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRepos.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRepos.fulfilled, (state, action) => {
        state.loading = false;
        state.repos.push(...action.payload);
      })
      .addCase(fetchRepos.rejected, (state, action) => {
        state.loading = false;
        if (action.error.message === 'Request failed with status code 403') {
          state.error = 'Превышено количество запросов, попробуйте позже';
        } else if (
          action.error.message === 'Request failed with status code 404'
        ) {
          state.error = 'Пользователь не найден';
        } else {
          state.error = action.error.message;
        }
      });
  },
});

export const { reset, incrementPage } = reposSlice.actions;
export default reposSlice.reducer;
