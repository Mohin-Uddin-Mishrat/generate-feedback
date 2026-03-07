import { Router } from 'express';
import feedbackRoute from './app/modules/feedBack/feedBack.route';


const appRouter = Router();

const moduleRoutes = [
    { path: '/feedback', route: feedbackRoute },
];

moduleRoutes.forEach(route => appRouter.use(route.path, route.route));
export default appRouter;