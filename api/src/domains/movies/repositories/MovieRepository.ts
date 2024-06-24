import { AxiosError } from "axios";
import MovieAPI from "./MovieAPI";

class MovieRepositoryClass {
  async getForYouMovies(movieId: number) {
    const forYouMovies = await MovieAPI.get(`/movie/${movieId}/recommendations`).then(
      (response) => {
        return response.data.results;
      }
    ).catch(
      (error: AxiosError) => {
        if (error.response) {
          throw error.response.data;
        }
    });

    return forYouMovies;
  }

  async getTopRatedMovies() {
    const topRatedMovies = await MovieAPI.get('/movie/top_rated?language=pt-BR').then(
      (response) => {
        return response.data.results;
      }
    ).catch(
      (error: AxiosError) => {
        if (error.response) {
          throw error.response.data;
        }
    });

    return topRatedMovies;
  }

  async getNowPlayingMovies() {
    const nowPlayingMovies = await MovieAPI.get('/movie/now_playing?language=pt-BR').then(
      (response) => {
        return response.data.results;
      }
    ).catch(
      (error: AxiosError) => {
        if (error.response) {
          throw error.response.data;
        }
    });

    return nowPlayingMovies;
  }

  async getMovieDetails(movieId: number) {
    const movieDetails = await MovieAPI.get(`/movie/${movieId}`).then(
      (response) => {
        return response.data;
      }
    ).catch(
      (error: AxiosError) => {
        if (error.response) {
          throw error.response.data;
        }
    });

    return movieDetails;
  }

  async getMovieCredits(movieId: number) {
    const movieCredits = await MovieAPI.get(`/movie/${movieId}/credits`).then(
      (response) => {
        return response.data;
      }
    ).catch(
      (error: AxiosError) => {
        if (error.response) {
          throw error.response.data;
        }
    });

    return movieCredits;
  }

  async getMovieProviders(movieId: number) {
    const movieProviders = await MovieAPI.get(`/movie/${movieId}/watch/providers`).then(
      (response) => {
        return response.data;
      }
    ).catch(
      (error: AxiosError) => {
        if (error.response) {
          throw error.response.data;
        }
    });

    return movieProviders;
  }
}

export const MovieRepository = new MovieRepositoryClass();