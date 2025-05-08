import express from 'express';
import { validateEmailDomain } from '../controllers/validationCotroller.js';

const router = express.Router();
router.get('/validate-email', validateEmailDomain);

export default router;
