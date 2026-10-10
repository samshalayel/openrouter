# FastAPI Backend Project

مشروع Backend بلغة Python FastAPI

## التثبيت والتشغيل

### 1. إنشاء بيئة افتراضية
```bash
python3 -m venv venv
source venv/bin/activate  # على Linux/Mac
# أو على Windows:
# venv\Scripts\activate
```

### 2. تثبيت المكتبات
```bash
pip install -r requirements.txt
```

### 3. تشغيل السيرفر
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

السيرفر سيعمل على: `http://localhost:8000`

### 4. الوثائق التفاعلية
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## هيكل المشروع

```
fastapi-project/
├── app/
│   ├── __init__.py
│   ├── main.py              # تطبيق FastAPI الرئيسي
│   ├── routers/             # راوترز API
│   ├── models/              # نماذج Database
│   └── schemas/             # Pydantic schemas
├── requirements.txt         # المكتبات المطلوبة
└── README.md               # هذا الملف
```

## المكتبات المثبتة

- **FastAPI**: إطار عمل الويب الحديث
- **Uvicorn**: خادم ASGI
- **SQLAlchemy**: ORM لإدارة قواعد البيانات
- **Pydantic**: التحقق من صحة البيانات
- **python-jose**: التعامل مع JWT
- **Passlib**: تشفير كلمات المرور

## الـ Endpoints المتوفرة

- `GET /` - رسالة ترحيب
- `GET /health` - فحص صحة السيرفر
- `GET /docs` - الوثائق التفاعلية
