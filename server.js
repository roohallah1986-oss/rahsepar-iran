import express from 'express';
import cors from 'cors';

import {
  requestOtp,
  verifyOtp,
  createPayment
} from './controller.js';

const app = express();

// تنظیمات اولیه
app.use(cors());
app.use(express.json());

// تست سلامت سرور
app.get('/', (req, res) => {
  res.send('🚛 Rahsepar backend is running...');
});

// مسیرهای احراز هویت OTP
app.post('/api/auth/request', requestOtp);
app.post('/api/auth/verify', verifyOtp);

// مسیرهای پرداخت
app.post('/api/payments/create', createPayment);

// راه‌اندازی سرور
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('🚛 موتور بک‌اَند ره‌سپار روشن شد!');
  console.log(`📍 آدرس محلی: http://localhost:${PORT}`);
  console.log('🚀 آماده دریافت درخواست‌ها از فرانت‌اَند...');
});
