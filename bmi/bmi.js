import express from 'express';
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router=express.Router();

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'bmi_home.html'));
});

router.post('/calculate-bmi', (req, res) => {
    const weight = parseFloat(req.body.weight);
    const height = parseFloat(req.body.height);
    const age=parseFloat(req.body.age);
    const gender=req.body.gender;
    const ethnicity=req.body.ethnicity;

    if (isNaN(weight) || isNaN(height) || weight <= 0 || height <= 0) {
        return res.send('Invalid input. Please enter positive numbers for weight and height.');
    }
    let bmi = weight / ((height / 100) ** 2);
    let category;
    if (age > 60) {
        bmi += 1;
    }
    if (gender === 'female') {
        bmi -= 1;
    }
    if(ethnicity=='asian'){
        if(bmi<18.5){
            category='Underweight';
        }else if(bmi<23.0){
            category='Normal weight';
        }else if(bmi<27.0){
            category='Overweight';
        }else{
            category='Obese';
        }
    }else if(ethnicity=='european'){
        if(bmi<18.5){
            category='Underweight';
        }else if(bmi<25.0){
            category='Normal weight';
        }else if(bmi<30.0){
            category='Overweight';
        }else{
            category='Obese';
        }
    }else if(ethnicity=='african'){
        if(bmi<19){
            category='Underweight';
        }else if(bmi<26.0){
            category='Normal weight';
        }else if(bmi<32.0){
            category='Overweight';
        }else{
            category='Obese';
        }
    }

    res.render('bmi_result', {
        bmi: bmi.toFixed(2),
        category: category
    });
});

export default router;