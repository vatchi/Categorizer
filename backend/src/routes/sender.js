import { Router } from 'express';
 
const router = Router();
 
router.get('/', async (req, res) => {
    const senders = await req.context.models.Sender.find();
    return res.send(senders);
  });
   
  router.get('/:userId', async (req, res) => {
    const sender = await req.context.models.Sender.findById(
      req.params.userId,
    );
    return res.send(sender);
  });
 
export default router;