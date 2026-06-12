const otps = new Map();

export const requestOtp = async (req, res) => {
    const { phone } = req.body;
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    otps.set(phone, { code, expires: Date.now() + 120000 });
    console.log(`کد تایید برای ${phone}: ${code}`);
    res.json({ success: true, message: 'کد ارسال شد' });
};

export const verifyOtp = async (req, res) => {
    const { phone, code } = req.body;
    const data = otps.get(phone);
    if (data && data.code === code && data.expires > Date.now()) {
        res.json({ success: true, token: 'OK-TOKEN', user: { phone } });
    } else {
        res.status(400).json({ success: false, message: 'کد اشتباه است' });
    }
};

export const createPayment = async (req, res) => {
    res.json({ success: true, url: 'https://zarinpal.com/pay/123' });
};
