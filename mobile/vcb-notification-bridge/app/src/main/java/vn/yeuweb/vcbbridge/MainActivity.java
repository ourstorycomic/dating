package vn.yeuweb.vcbbridge;

import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.os.PowerManager;
import android.provider.Settings;
import android.view.Gravity;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.widget.TextView;

public class MainActivity extends android.app.Activity {
    private EditText webhookInput;
    private EditText secretInput;
    private EditText packageInput;
    private TextView statusText;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        SharedPreferences prefs = getSharedPreferences("bridge", MODE_PRIVATE);

        ScrollView scrollView = new ScrollView(this);
        LinearLayout root = new LinearLayout(this);
        root.setOrientation(LinearLayout.VERTICAL);
        root.setPadding(36, 42, 36, 42);
        root.setBackgroundColor(Color.rgb(255, 247, 251));
        scrollView.addView(root);

        TextView title = new TextView(this);
        title.setText("Yeuweb VCB Bridge");
        title.setTextColor(Color.rgb(37, 19, 31));
        title.setTextSize(28);
        title.setGravity(Gravity.START);
        title.setTypeface(null, 1);
        root.addView(title, fullWidth());

        TextView note = new TextView(this);
        note.setText("App đọc notification giao dịch trên máy của bạn, tìm mã PAY và số tiền rồi gửi về webhook Yeuweb. Không đăng nhập ngân hàng, không đọc màn hình VCB.");
        note.setTextColor(Color.rgb(122, 82, 105));
        note.setTextSize(15);
        note.setPadding(0, 18, 0, 24);
        root.addView(note, fullWidth());

        webhookInput = input("Webhook URL", prefs.getString("webhookUrl", ""));
        secretInput = input("Webhook Secret", prefs.getString("secret", ""));
        packageInput = input("Package VCB (để trống để test mọi app)", prefs.getString("packageFilter", ""));

        root.addView(webhookInput, fullWidth());
        root.addView(secretInput, fullWidth());
        root.addView(packageInput, fullWidth());

        Button saveButton = button("Lưu cấu hình");
        saveButton.setOnClickListener(view -> {
            prefs.edit()
                .putString("webhookUrl", webhookInput.getText().toString().trim())
                .putString("secret", secretInput.getText().toString().trim())
                .putString("packageFilter", packageInput.getText().toString().trim())
                .apply();
            statusText.setText("Đã lưu. Hãy bật Notification Access rồi chuyển khoản test đúng mã PAY.");
        });
        root.addView(saveButton, fullWidth());

        Button permissionButton = button("Mở quyền Notification Access");
        permissionButton.setOnClickListener(view -> startActivity(new Intent(Settings.ACTION_NOTIFICATION_LISTENER_SETTINGS)));
        root.addView(permissionButton, fullWidth());

        Button batteryButton = button("Tat toi uu pin cho app");
        batteryButton.setOnClickListener(view -> requestIgnoreBatteryOptimization());
        root.addView(batteryButton, fullWidth());

        Button appSettingsButton = button("Mở cài đặt app");
        appSettingsButton.setOnClickListener(view -> {
            Intent intent = new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
            intent.setData(Uri.parse("package:" + getPackageName()));
            startActivity(intent);
        });
        root.addView(appSettingsButton, fullWidth());

        statusText = new TextView(this);
        statusText.setText("Webhook URL mẫu: https://domain-cua-ban.com/api/webhooks/banking");
        statusText.setTextColor(Color.rgb(122, 82, 105));
        statusText.setTextSize(14);
        statusText.setPadding(0, 22, 0, 0);
        root.addView(statusText, fullWidth());

        setContentView(scrollView);
    }

    private EditText input(String hint, String value) {
        EditText input = new EditText(this);
        input.setHint(hint);
        input.setText(value);
        input.setSingleLine(true);
        input.setTextColor(Color.rgb(37, 19, 31));
        input.setHintTextColor(Color.rgb(145, 100, 126));
        input.setTextSize(15);
        input.setPadding(24, 12, 24, 12);
        return input;
    }

    private Button button(String text) {
        Button button = new Button(this);
        button.setText(text);
        button.setTextColor(Color.WHITE);
        button.setTextSize(15);
        button.setAllCaps(false);
        button.setBackgroundColor(Color.rgb(236, 72, 153));
        return button;
    }

    private void requestIgnoreBatteryOptimization() {
        PowerManager powerManager = (PowerManager) getSystemService(POWER_SERVICE);
        if (powerManager != null && powerManager.isIgnoringBatteryOptimizations(getPackageName())) {
            statusText.setText("App da duoc bo toi uu pin. Neu may co tinh nang khoa app trong da nhiem, hay khoa app lai.");
            return;
        }

        Intent requestIntent = new Intent(Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS);
        requestIntent.setData(Uri.parse("package:" + getPackageName()));
        try {
            startActivity(requestIntent);
        } catch (Exception error) {
            startActivity(new Intent(Settings.ACTION_IGNORE_BATTERY_OPTIMIZATION_SETTINGS));
        }
    }

    private LinearLayout.LayoutParams fullWidth() {
        LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT,
            ViewGroup.LayoutParams.WRAP_CONTENT
        );
        params.setMargins(0, 10, 0, 10);
        return params;
    }
}
