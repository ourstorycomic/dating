# Yeuweb VCB Notification Bridge

Android helper app de tu dong mo khoa don Yeuweb khi dien thoai nhan notification giao dich ngan hang co ma `PAY...`.

## Cach hoat dong

1. VCB gui notification giao dich ve dien thoai.
2. App nay co quyen Notification Access, doc text notification.
3. Neu text co ma `PAYxxxxxx` va so tien `VND`, app POST ve:

```text
https://domain-cua-ban.com/api/webhooks/banking
```

4. Web Yeuweb doi chieu payment code + amount roi mo khoa don.

## Cau hinh trong app

- Webhook URL: `https://domain-cua-ban.com/api/webhooks/banking`
- Webhook Secret: trung voi `BANK_WEBHOOK_SECRET` tren server web
- Package VCB: co the de trong de test moi notification. Sau khi test on, dien package app ngan hang neu biet.

## Bat buoc de app khong bi Android kill

1. Bam `Mo quyen Notification Access` va bat quyen cho `Yeuweb VCB Bridge`.
2. Bam `Tat toi uu pin cho app` va cho phep app chay khong bi tiet kiem pin.
3. Vao man hinh da nhiem/Recent Apps, khoa app lai neu dien thoai co nut khoa.
4. Tren Xiaomi/Oppo/Vivo/Realme, mo them `Autostart`/`Background activity` trong cai dat app neu co.
5. Khong force stop app. Neu restart may, mo lai app mot lan de kiem tra quyen.

## Chong trung giao dich

- App tao `transactionId` bang SHA-256 tu package app ngan hang + ma PAY + so tien + noi dung notification.
- App chi danh dau da xu ly khi server tra HTTP 2xx.
- Backend luu `webhook_events(provider, provider_transaction_id)` voi unique constraint.
- Neu notification bi ban 2 lan, backend tra `duplicate: true` va khong tao hoa hong/mo khoa lai lan nua.

## Bao mat webhook

- Moi request gui header:

```text
x-webhook-secret: <Webhook Secret trong app>
```

- Backend chi nhan request neu header nay khop `BANK_WEBHOOK_SECRET` tren server.
- Khong chia se secret nay, khong commit vao GitHub.

## Build

Mo thu muc nay bang Android Studio:

```text
mobile/vcb-notification-bridge
```

Sau do chon:

```text
Build > Build APK(s)
```

Hoac neu may da co Android SDK/Gradle:

```bash
./gradlew assembleDebug
```

APK nam o:

```text
app/build/outputs/apk/debug/app-debug.apk
```

## Gioi han

- Khong doc noi bo app VCB, khong dang nhap ngan hang, khong vuot bao mat.
- Chi doc notification ma Android cap quyen.
- Neu notification VCB khong hien so tien/noi dung CK thi app khong the tu doi chieu.
- Dien thoai phai online, app khong bi battery saver kill.
- Giai phap nay phu hop test/chi phi thap. Production tot hon van nen dung SePay/Casso webhook.
