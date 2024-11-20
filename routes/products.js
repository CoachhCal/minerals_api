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
        res.status(400).json({message: 'Invalid ID'});
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

router.post('/purchase', async (req,res) => {
    if(!req.session.user){
        return res.status(401).send('Not logged in');
    }

    const {street, city, province, country, postal_code, credit_card, credit_expire, credit_cvv, cart, invoice_amt, invoice_tax, invoice_total} = req.body;

    const purchase = await prisma.purchase.create({
        data: {
            customer_id: parseInt(req.session.user.customer_id),
            street: street,
            city: city,
            province: province,
            country: country,
            postal_code: postal_code,
            credit_card: credit_card,
            credit_expire: credit_expire,
            credit_cvv: credit_cvv,
            invoice_amt: parseFloat(invoice_amt),
            invoice_tax: parseFloat(invoice_tax),
            invoice_total: parseFloat(invoice_total)
        }
    })

    const productArray = cart.split(",")

    let indexedArray = [];
    let quant = 0;

    for(let outerLoop = 0; outerLoop<productArray.length; outerLoop++){

        for(let innerLoop = 0;innerLoop<productArray.length; innerLoop++){

            if(indexedArray.indexOf(productArray[outerLoop])!=-1){ //did we already process this product? if so, break and move to the next
                break;
            }
            if(productArray[innerLoop] == productArray[outerLoop]){ //does the product_id match in the inner and outloops? if so, add one to the quantity counter
                quant+=1;
            }
            if(innerLoop == productArray.length-1){ //are we at the end of the inner loop array?
                const purchaseItem = await prisma.purchaseItem.create({ //if so, create the record for the specific product_id we are looking at
                    data: {
                        purchase_id: purchase.purchase_id,
                        product_id: parseInt(productArray[outerLoop]),
                        quantity: parseInt(quant)
                    }
                })
                indexedArray.push(productArray[outerLoop]) //add the current product_id to this array so that we know to skip it if the same product comes up again in the cart/array
                quant = 0; //reset quantity counter
            }
        }
    }

    res.json({'Purchase' : purchase});
})

export default router;