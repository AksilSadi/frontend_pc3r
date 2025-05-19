
export type Film = {
  id: number;
  documentId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  id_film: string;
  title: string;
  overview: string;
  original_language: string;
  original_title: string;
  adult: boolean;
  release_date: string;
  Video: boolean;
  Backdrop_path: string;
  poster_path: string;
  popularity_tmdb: number;
  popularity_website: number;
  vote_average_tmdb: number;
  vote_average_website: number;
  vote_count_tmdb: number;
  vote_count_website: number;
  page_fetched_from: string;
  genre_tv_films: number[];
};

export type TVShow = {
  id: number;
  documentId: string;
  id_TvShow: string;
  Name: string;
  original_Name: string;
  original_language: string;
  adult: boolean;
  overview: string;
  Origin_country: string[];
  first_air_date: string;
  poster_path: string;
  backdrop_path: string;
  popularity_tmdb: number;
  popularity_website: number;
  vote_average_tmdb: number;
  vote_average_website: number;
  vote_count_tmdb: number | string; 
  vote_count_website: number | string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  page_fetched_from: string;
  genre_tv_films: number[];
};

export type FormProps = {
  type: string;
  clicked: Film | TVShow;
};
export type RecommendationProps = FormProps & {
  onRecommendationClick: (film: Film | TVShow, type: string) => void;
};

export type SectionMovies = {
  pages: {
    [pageNumber: number]: Film | TVShow[];  // tableau de films par page
  };
  totalPages: number;              // nombre total de pages pour cette section
};

export type MoviesBySection = {
  [section: string]: SectionMovies | undefined; // section : tableau de films
};
