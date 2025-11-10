import express from 'express';
import { storeRecentSearches, userData } from '../controllers/UserController.js';
import { protect } from '../middlewares/AuthMiddleWares.js';

const userRouter = express.Router();

userRouter.get('/', protect , userData);
userRouter.post('/store-recent-searched', protect , storeRecentSearches);

export default userRouter;