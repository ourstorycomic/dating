package vn.yeuweb.vcbbridge;

import android.app.Notification;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.service.notification.NotificationListenerService;
import android.service.notification.StatusBarNotification;

import org.json.JSONObject;

import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Locale;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class BankNotificationListener extends NotificationListenerService {
    private static final Pattern PAY_CODE_PATTERN = Pattern.compile("PAY[A-Z0-9]{6,12}", Pattern.CASE_INSENSITIVE);
    private static final Pattern AMOUNT_PATTERN = Pattern.compile("([0-9][0-9.,]*)\\s*(VND|VNĐ|đ)", Pattern.CASE_INSENSITIVE);

    @Override
    public void onNotificationPosted(StatusBarNotification sbn) {
        SharedPreferences prefs = getSharedPreferences("bridge", MODE_PRIVATE);
        String webhookUrl = prefs.getString("webhookUrl", "");
        String secret = prefs.getString("secret", "");
        String packageFilter = prefs.getString("packageFilter", "");

        if (webhookUrl == null || webhookUrl.trim().isEmpty() || secret == null || secret.trim().isEmpty()) {
            return;
        }

        if (packageFilter != null && !packageFilter.trim().isEmpty() && !sbn.getPackageName().equals(packageFilter.trim())) {
            return;
        }

        Bundle extras = sbn.getNotification().extras;
        String title = safeText(extras.getCharSequence(Notification.EXTRA_TITLE));
        String text = safeText(extras.getCharSequence(Notification.EXTRA_TEXT));
        String bigText = safeText(extras.getCharSequence(Notification.EXTRA_BIG_TEXT));
        String content = (title + " " + text + " " + bigText).trim();

        Matcher codeMatcher = PAY_CODE_PATTERN.matcher(content.toUpperCase(Locale.ROOT));
        if (!codeMatcher.find()) {
            return;
        }

        Matcher amountMatcher = AMOUNT_PATTERN.matcher(content);
        if (!amountMatcher.find()) {
            return;
        }

        String paymentCode = codeMatcher.group(0).toUpperCase(Locale.ROOT);
        long amount = parseAmount(amountMatcher.group(1));
        if (amount <= 0) {
            return;
        }

        String transactionId = fingerprint(sbn.getPackageName() + "|" + paymentCode + "|" + amount + "|" + content);
        Set<String> processed = prefs.getStringSet("processedTransactionIds", null);
        if (processed != null && processed.contains(transactionId)) {
            return;
        }

        postWebhook(prefs, webhookUrl.trim(), secret.trim(), paymentCode, amount, content, sbn.getPackageName(), transactionId);
    }

    private String safeText(CharSequence value) {
        return value == null ? "" : value.toString();
    }

    private long parseAmount(String raw) {
        String cleaned = raw.replace(".", "").replace(",", "").replace(" ", "");
        try {
            return Long.parseLong(cleaned);
        } catch (NumberFormatException error) {
            return 0;
        }
    }

    private String fingerprint(String raw) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(raw.getBytes(StandardCharsets.UTF_8));
            StringBuilder builder = new StringBuilder();
            for (byte item : hash) {
                builder.append(String.format(Locale.ROOT, "%02x", item));
            }
            return builder.toString();
        } catch (Exception error) {
            return String.valueOf(raw.hashCode());
        }
    }

    private void markProcessed(SharedPreferences prefs, String transactionId) {
        Set<String> current = prefs.getStringSet("processedTransactionIds", new java.util.HashSet<>());
        java.util.LinkedHashSet<String> next = new java.util.LinkedHashSet<>(current);
        next.add(transactionId);
        while (next.size() > 200) {
            String first = next.iterator().next();
            next.remove(first);
        }
        prefs.edit().putStringSet("processedTransactionIds", next).apply();
    }

    private void postWebhook(SharedPreferences prefs, String webhookUrl, String secret, String paymentCode, long amount, String content, String packageName, String transactionId) {
        new Thread(() -> {
            HttpURLConnection connection = null;
            try {
                JSONObject payload = new JSONObject();
                payload.put("paymentCode", paymentCode);
                payload.put("transferAmount", amount);
                payload.put("transferType", "in");
                payload.put("content", content);
                payload.put("description", content);
                payload.put("gateway", "VCB_NOTIFICATION_BRIDGE");
                payload.put("referenceCode", transactionId);
                payload.put("transactionId", transactionId);
                payload.put("sourcePackage", packageName);

                URL url = new URL(webhookUrl);
                connection = (HttpURLConnection) url.openConnection();
                connection.setRequestMethod("POST");
                connection.setConnectTimeout(8000);
                connection.setReadTimeout(8000);
                connection.setDoOutput(true);
                connection.setRequestProperty("Content-Type", "application/json; charset=utf-8");
                connection.setRequestProperty("x-webhook-secret", secret);

                byte[] body = payload.toString().getBytes(StandardCharsets.UTF_8);
                connection.setFixedLengthStreamingMode(body.length);
                try (OutputStream stream = connection.getOutputStream()) {
                    stream.write(body);
                }
                int status = connection.getResponseCode();
                if (status >= 200 && status < 300) {
                    markProcessed(prefs, transactionId);
                }
            } catch (Exception ignored) {
                // Keep the listener silent. Failed notifications can be retried by sending a new test transfer.
            } finally {
                if (connection != null) {
                    connection.disconnect();
                }
            }
        }).start();
    }
}
