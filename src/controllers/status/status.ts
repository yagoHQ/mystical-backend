import { Request, Response } from 'express';

const statusController = {
  status: async (req: Request, res: Response) => {
    res.status(200).send('Server is running\n');
  },
};

export default statusController;
