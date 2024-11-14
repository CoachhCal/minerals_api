import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  });

router.get('/all', async (req, res) => {
    const minerals = await prisma.product.findMany();
    if(minerals){
        
        res.json(minerals);
    }
  });

router.get('/:id', async (req, res) => {
    const id = req.params.id;

    //validate if not a number
    if(isNaN(id)){
        res.status(400).json({message: 'Invalid contact ID'});
        return;
    }

    const mineral = await prisma.product.findUnique({
        where: {
        product_id: parseInt(id)
        }
    })

    if(mineral){
        res.json(mineral); //display object
    } else{
        res.status(404).json({message: `Record ${id} not found`});
    }
});

router.get('/checkout', async (req,res) => {

})

export default router;