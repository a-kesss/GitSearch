import { store } from '../redux/store';

export interface Repo {
  id: number;
  node_id: string;
  name: string;
  description: string | null;
  stargazers_count: number;
  updated_at: string;
  html_url: string;
}

export interface ReposState {
  repos: Repo[];
  loading: boolean;
  error: string | undefined;
  page: number;
}

export type AppDispatch = typeof store.dispatch;
