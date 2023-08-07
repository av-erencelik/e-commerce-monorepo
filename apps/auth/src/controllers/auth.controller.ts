import { Request, Response } from 'express';
import authService from '../services/auth.service';

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  res.send(user);
};

export default Object.freeze({
  login,
});
