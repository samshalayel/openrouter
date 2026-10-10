'use client';

import { useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // API call example using axios
      const response = await axios.get('/api/health');
      console.log('Response:', response.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">مرحبا بك في OpenRouter</h2>
        <p className="text-gray-600">منصة توجيه ذكية للوصول إلى نماذج الذكاء الاصطناعي</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
        <div className="mb-4">
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
            الرسالة
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="أدخل رسالتك هنا..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={4}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg disabled:bg-gray-400 transition-colors"
        >
          {loading ? 'جاري المعالجة...' : 'إرسال'}
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-bold text-gray-900 mb-2">سريع</h3>
          <p className="text-sm text-gray-600">استجابة فورية من نماذج متعددة</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-bold text-gray-900 mb-2">آمن</h3>
          <p className="text-sm text-gray-600">تشفير النقل والبيانات الآمنة</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-bold text-gray-900 mb-2">موثوق</h3>
          <p className="text-sm text-gray-600">ضمان التوفر والأداء العالي</p>
        </div>
      </div>
    </div>
  );
}
