# Kamera Destekli Öğrenci Yanıt Paneli

Sınıfta aynı kameraya bakan en fazla 5 öğrenciyi yüzlerinden kaydedip, tuttukları A4 kağıdındaki cevap metnini **Tesseract.js** ile okuyarak doğru cevapta "Yağız doğru bildin" bildirimi veren tarayıcı tabanlı demo.

## Nasıl çalışır?
1. Depoyu indir veya aç: `index.html` dosyasını modern bir tarayıcıda aç.
2. Tarayıcı kameraya erişim izni ister; onaylayın.
3. **Soru** ve **doğru cevap** alanlarını doldurup kaydedin.
4. Öğrencileri kameraya sığdırıp sırayla **Yüzü kaydet** butonuna basın (maksimum 5).
5. Kağıdı alt şeritte gösterip **Kareyi tara** dediğinizde yüz eşleşmesi + OCR sonucu bildirim olarak görünür.

## Teknik notlar
- Yüz tespiti için tarayıcı `FaceDetector` API'sını kullanır; destek yoksa tüm kareyi tek yüz gibi değerlendirerek piksel farkı ile en yakın eşleşmeyi dener.
- Cevap okuma, kareyin alt %28'lik bölümünde **Tesseract.js** (CDN) ile yapılır; Türkçe dil modeli (`tur`) kullanılır.
- Yüz karşılaştırması karmaşık ML yerine piksel ortalama farkına göre basit bir eşleşme eşiği ile çalışır; ışık ve kadraj sabitliği önemlidir.

Keyifli dersler! 📸
