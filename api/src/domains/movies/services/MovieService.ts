import { AxiosError } from "axios";
import api from "./api";
import prisma from "../../../../libs/prisma";

class MovieServiceClass {
  async getTrendingMovies() {
    const trendingMovies = await api.get('/trending/movie/week').then(
      (response) => {
        return response.data;
      }
    ).catch(
      (error: AxiosError) => {
        if (error.response) {
          throw error.response.data;
        }
    });

    return trendingMovies;
  }

  async getMovieDetails(id: string) {
    const movieDetails = await api.get(`/movie/${id}`).then(
      (response) => {
        return response.data;
      }
    ).catch(
      (error: AxiosError) => {
        if (error.response) {
          throw error.response.data;
        }
    });

    const movieCredits = await api.get(`/movie/${id}/credits`).then(
      (response) => {
        return response.data;
      }
    ).catch(
      (error: AxiosError) => {
        if (error.response) {
          throw error.response.data;
        }
    });

    const movieProviders = await api.get(`/movie/${id}/watch/providers`).then(
      (response) => {
        return response.data;
      }
    ).catch(
      (error: AxiosError) => {
        if (error.response) {
          throw error.response.data;
        }
    });

    const actors = movieCredits.cast.filter((actor: { known_for_department: string }) => actor.known_for_department === "Acting");
    const stars = actors.slice(0, 5);

    const directors = movieCredits.crew.filter((crewMember: { known_for_department: string }) => crewMember.known_for_department === "Directing");
    const directorsNames = directors.map((director: { name: string }) => director.name);

    const writers = movieCredits.crew.filter((crewMember: { known_for_department: string }) => crewMember.known_for_department === "Writing");
    const writersNames = writers.map((writer: { name: string }) => writer.name);

    const providers = movieProviders.results.BR.flatrate.map((provider: { provider_name: string }) => provider.provider_name);

    const movieInfo = {
      "genres": movieDetails.genres.map((genre: { name: string }) => genre.name),
      "plot": movieDetails.overview,
      "rating": movieDetails.vote_average,
      "releaseDate": movieDetails.release_date,
      "backdrop": movieDetails.backdrop_path,
      "poster": movieDetails.poster_path,
      "runtime": movieDetails.runtime,
      "title": movieDetails.title,
      "stars": stars.map((actor: { name: string }) => actor.name),
      "director": directorsNames,
      "writers": writersNames,
      "providers": providers
    }

    return movieInfo;
  }

  async createRating(id: string, rating: number, userId: string) {
    const createdRating = await prisma.rating.create({
      data: {
        rating: rating,
        movieId: id,
        user: {
          connect: {
            id: userId
          }
        }
      }
    });

    return createdRating;
  }

  async getRating(id: string) {
    const rating = await api.get(`/movie/${id}`).then(
      (response) => {
        return response.data;
      }
    ).catch(
      (error: AxiosError) => {
        if (error.response) {
          throw error.response.data;
        }
    });

    const apiRating = rating.vote_average;

    const ratings = await prisma.rating.findMany({
      where: {
        movieId: id,
        rating: !null
      }
    });
    
    if (ratings.length === 0) {
      return apiRating;
    }

    const sum = ratings.reduce((acc, rating) => acc + rating.rating, 0); 

    const average = (sum + apiRating) / (ratings.length + 1);

    return average;
  }

  async createReview(id: string, review: string, userId: string) {
    const existentRating = await prisma.rating.findFirst({
      where: {
        movieId: id,
        userId: userId
      }
    });

    if (existentRating) {
      await prisma.rating.update({
        where: {
          id: existentRating.id
        },
        data: {
          review: review
        }
      });

      return existentRating;
    }

    const createdRating = await prisma.rating.create({
      data: {
        review: review,
        movieId: id,
        user: {
          connect: {
            id: userId
          }
        }
      }
    });

    return createdRating;
  }

  async getReviews(id: string) {
    const reviews = await prisma.rating.findMany({
      where: {
        movieId: id,
        review: !null
      }
    });

    return reviews;
  }

  async watchedMovie(id: string, userId: string) {
    const existentRating = await prisma.rating.findFirst({
      where: {
        movieId: id,
        userId: userId
      }
    });

    if (existentRating) {
      await prisma.rating.update({
        where: {
          id: existentRating.id
        },
        data: {
          watched: true
        }
      });

      return existentRating;
    }

    const createdRating = await prisma.rating.create({
      data: {
        watched: true,
        movieId: id,
        user: {
          connect: {
            id: userId
          }
        }
      }
    });

    return createdRating;
  }

}

export const MovieService = new MovieServiceClass();