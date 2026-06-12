import express from 'express';
import cors from 'cors';

const app = express();

// تنظیمات اولیه
app.use(cors());
app.use(express.json());

// دیتابیس‌های موقت در حافظه (تا قبل از وصل کردن دیتابیس اصلی)
const users = [];
const otps = new Map();

// --- مسیرهای احراز هویت (OTP) ---

// 1. درخواست ارسال کد تایید
app.post('/api/auth/request', (req, res) => {
    const { phone } = req.body;
    
    if (!phone || phone.length < 11) {
        return res.status(400).json({ success: false, message: 'شماره موبایل معتبر نیست' });
    }

    // تولید کد ۶ رقمی تصادفی
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    // ذخیره کد به همراه زمان انقضا (مثلا ۲ دقیقه بعد)
    otps.set(phone, { 
        code: code, 
        expiry: Date.now() + 120000 
    });
    
    // چون فعلاً پنل پیامک نداریم، کد رو در کنسول سرور چاپ می‌کنیم
    console.log(`------------------------------`);
    console.log(`📩 پیامک برای شماره: ${phone}`);
    console.log(`🔑 کد تایید شما: ${code}`);
    console.log(`------------------------------`);

    res.json({ success: true, message: 'کد تایید با موفقیت (به کنسول) ارسال شد' });
});

// 2. بررسی صحت کد تایید (لاگین)
app.post('/api/auth/verify', (req, res) => {
    const { phone, code } = req.body;
    const storedData = otps.get(phone);

    if (!storedData) {
        return res.status(400).json({ success: false, message: 'ابتدا درخواست کد بدهید' });
    }

    if (Date.now() > storedData.expiry) {
        otps.delete(phone);
        return res.status(400).json({ success: false, message: 'کد منقضی شده است' });
    }

    if (storedData.code === code) {
        // حذف کد استفاده شده
        otps.delete(phone);
        
        // شبیه‌سازی ایجاد توکن امنیتی
        res.json({ 
            success: true, 
            token: 'RAHSEPAR_SECRET_TOKEN_' + Math.random().toString(36).substr(2),
            user: { phone, role: 'driver' } 
        });
    } else {
        res.status(400).json({ success: false, message: 'کد وارد شده اشتباه است' });
    }
});

// --- مسیرهای مربوط به درگاه پرداخت (شبیه‌سازی) ---

app.post('/api/payments/create', (req, res) => {
    const { amount, userId } = req.body;
    
    console.log(`ایجاد تراکنش به مبلغ ${amount} برای کاربر ${userId}`);
    
    // در اینجا فقط یک لینک فرضی برمی‌گردانیم
    res.json({ 
        success: true, 
        paymentUrl: `https://sep.shaparak.ir/payment?token=${Math.random().toString(36).substr(2)}`,
        message: 'در حال انتقال به درگاه پرداخت...'
    });
});

// --- راه‌اندازی سرور ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚛 موتور بک‌اَند ره‌سپار روشن شد!`);
    console.log(`📍 آدرس محلی: http://localhost:${PORT}`);
    console.log(`🚀 آماده دریافت درخواست‌ها از فرانت‌اَند...`);
});
