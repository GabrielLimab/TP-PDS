import { Router, Request, Response, NextFunction } from 'express';
import { MovieService } from '../services/MovieService';
import { loginMiddleware,
  verifyJWT,
  notLoggedIn } from '../../../middlewares/auth';
import { statusCodes } from '../../../../utils/constants/status-codes';
export const router = Router();

router.get('/trending', 
  verifyJWT, 
  async(req: Request, res: Response, next:NextFunction) => {  
    try {
      const movies = await MovieService.getTrendingMovies();
      res.status(statusCodes.SUCCESS).json(movies);
    } catch (error) { 
      next(error);
    }
  },
);

router.get('/:id',
  verifyJWT,
  async(req: Request, res: Response, next:NextFunction) => {
    try {
      const movieImages = await MovieService.getMovieDetails(req.params.id);
      res.status(statusCodes.SUCCESS).json(movieImages);
    } catch (error) {
      next(error);
    }
  },
);

router.post('/:id/rating',
  verifyJWT,
  async(req: Request, res: Response, next:NextFunction) => {
    try {
      const rating = await MovieService.createRating(req.params.id, req.body.rating, req.userId!);
      res.status(statusCodes.CREATED).json(rating);
    } catch (error) {
      next(error);
    }
  },
);

router.get('/:id/rating',
  verifyJWT,
  async(req: Request, res: Response, next:NextFunction) => {
    try {
      const rating = await MovieService.getRating(req.params.id);
      res.status(statusCodes.SUCCESS).json(rating);
    } catch (error) {
      next(error);
    }
  }
);

router.post('/:id/review',
  verifyJWT,
  async(req: Request, res: Response, next:NextFunction) => {
    try {
      const review = await MovieService.createReview(req.params.id, req.body.review, req.userId!);
      res.status(statusCodes.CREATED).json(review);
    } catch (error) {
      next(error);
    }
  },
);

router.get('/:id/reviews',
  verifyJWT,
  async(req: Request, res: Response, next:NextFunction) => {
    try {
      const reviews = await MovieService.getReviews(req.params.id);
      res.status(statusCodes.SUCCESS).json(reviews);
    } catch (error) {
      next(error);
    }
  },
);

router.post('/:id/watched',
  verifyJWT,
  async(req: Request, res: Response, next:NextFunction) => {
    try {
      const watched = await MovieService.createWatched(req.params.id, req.userId!);
      res.status(statusCodes.CREATED).json(watched);
    } catch (error) {
      next(error);
    }
  },
);



