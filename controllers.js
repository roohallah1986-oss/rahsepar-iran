import fetch from "node-fetch";
const otps = new Map();

/* ================================
   ✅ درخواست کد تایید (ارسال پیامک واقعی)
================================ */
export const requestOtp = async (req, res) => {
  const { phone } = req.body;

  if (!/^09\d{9}$/.test(phone || '')) {
    return res.status(400).json({
      success: false,
      message: 'شماره موبایل نامعتبر است'
    });
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();

  otps.set(phone, {
    code,
    expires: Date.now() + 2 * 60 * 1000
  });

  try {
    const smsResponse = await fetch(
      "https://api.payam-resan.com/v1/sms/send",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer 279226-823b40c12da6422499743b28c7ef55b2"
        },
        body: JSON.stringify({
          to: phone,
          message: `کد تایید ره‌سپار ایران: ${code}`
        })
      }
    );

    const smsResult = await smsResponse.json();
    console.log("✅ نتیجه ارسال پیامک:", smsResult);

  } catch (error) {
    console.error("❌ خطا در ارسال پیامک:", error);
    return res.status(500).json({
      success: false,
      message: 'خطا در ارسال پیامک'
    });
  }

  return res.json({
    success: true,
    message: 'کد تایید با موفقیت ارسال شد'
  });
};


/* ================================
   ✅ تایید کد
================================ */
export const verifyOtp = async (req, res) => {
  const { phone, code } = req.body;
  const data = otps.get(phone);

  if (!/^09\d{9}$/.test(phone || '')) {
    return res.status(400).json({
      success: false,
      message: 'شماره موبایل نامعتبر است'
    });
  }

  if (!String(code || '').trim()) {
    return res.status(400).json({
      success: false,
      message: 'کد تایید را وارد کنید'
    });
  }

  if (!data) {
    return res.status(400).json({
      success: false,
      message: 'ابتدا درخواست کد بدهید'
    });
  }

  if (data.expires <= Date.now()) {
    otps.delete(phone);

    return res.status(400).json({
      success: false,
      message: 'کد منقضی شده است'
    });
  }

  if (data.code !== String(code).trim()) {
    return res.status(400).json({
      success: false,
      message: 'کد وارد شده اشتباه است'
    });
  }

  otps.delete(phone);

  return res.json({
    success: true,
    token: 'RAHSEPAR_SECRET_TOKEN_' + Math.random().toString(36).slice(2),
    user: {
      phone,
      role: 'driver'
    }
  });
};


/* ================================
   ✅ ایجاد پرداخت (بدون تغییر)
================================ */
export const createPayment = async (req, res) => {
  const { amount, userId } = req.body;

  if (!amount || Number(amount) <= 0) {
    return res.status(400).json({
      success: false,
      message: 'مبلغ پرداخت نامعتبر است'
    });
  }

  console.log(`ایجاد تراکنش به مبلغ ${amount} برای کاربر ${userId || 'ناشناس'}`);

  return res.json({
    success: true,
    paymentUrl: `https://sep.shaparak.ir/payment?token=${Math.random().toString(36).slice(2)}`,
    message: 'در حال انتقال به درگاه پرداخت...'
  });
};
