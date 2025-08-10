const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(__dirname)); // يخدم الملفات الثابتة مثل index.html

// 🔹 مسار ملف الطلبات
const ordersFile = path.join(__dirname, 'orders.json');

// 🔹 إنشاء الملف إذا لم يكن موجودًا
if (!fs.existsSync(ordersFile)) {
  fs.writeFileSync(ordersFile, '[]');
}

// 🔹 API لحفظ الطلب
app.post('/api/orders', (req, res) => {
  const newOrder = req.body;

  fs.readFile(ordersFile, 'utf8', (err, data) => {
    let orders = [];
    if (!err && data) {
      try {
        orders = JSON.parse(data);
      } catch (e) {
        orders = [];
      }
    }

    orders.push(newOrder);

    fs.writeFile(ordersFile, JSON.stringify(orders, null, 2), err => {
      if (err) {
        console.error('❌ خطأ في حفظ الطلب:', err);
        res.status(500).send('خطأ في الحفظ');
      } else {
        res.status(200).send('تم حفظ الطلب');
      }
    });
  });
});

// 🔹 API لجلب الطلبات (اختياري)
app.get('/api/orders', (req, res) => {
  fs.readFile(ordersFile, 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('خطأ في قراءة الطلبات');
    } else {
      res.json(JSON.parse(data));
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 السيرفر يعمل على http://localhost:${PORT}`);
});