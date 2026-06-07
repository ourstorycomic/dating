"use client";

import { useMemo, useState } from "react";

type Rule = {
  is_active: boolean;
  percentage: number;
  recipient_type: "AFFILIATE" | "EMPLOYEE" | "STAFF";
};

const labels: Record<Rule["recipient_type"], string> = {
  AFFILIATE: "Affiliate / TikToker",
  EMPLOYEE: "Nhân viên tạo đơn",
  STAFF: "Staff quản lý",
};

export function CommissionRulesForm({ rules }: { rules: Rule[] }) {
  const initialRules = useMemo(() => {
    const map = new Map(rules.map((rule) => [rule.recipient_type, rule]));
    return (["EMPLOYEE", "STAFF", "AFFILIATE"] as const).map((type) => ({
      isActive: map.get(type)?.is_active ?? true,
      percentage: Number(map.get(type)?.percentage ?? 0),
      recipientType: type,
    }));
  }, [rules]);

  const [items, setItems] = useState(initialRules);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    setMessage("");

    const response = await fetch("/api/admin/commission-rules", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rules: items }),
    });

    const data = await response.json();
    setSaving(false);

    if (!response.ok) {
      setMessage(data.error ?? "Không lưu được cấu hình.");
      return;
    }

    setMessage("Đã lưu cấu hình hoa hồng.");
  }

  return (
    <div className="grid gap-4">
      {items.map((item, index) => (
        <div className="grid gap-3 rounded-2xl border border-white/10 bg-white/[0.05] p-4 md:grid-cols-[1fr_160px_110px]" key={item.recipientType}>
          <div>
            <p className="font-semibold">{labels[item.recipientType]}</p>
            <p className="mt-1 text-xs text-white/50">{item.recipientType}</p>
          </div>
          <label className="grid gap-1 text-sm">
            <span className="text-white/54">% hoa hồng</span>
            <input
              className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 outline-none focus:border-pink-300/50"
              max={100}
              min={0}
              onChange={(event) => {
                const next = [...items];
                next[index] = { ...item, percentage: Number(event.target.value) };
                setItems(next);
              }}
              step="0.1"
              type="number"
              value={item.percentage}
            />
          </label>
          <label className="flex items-center gap-2 text-sm text-white/70">
            <input
              checked={item.isActive}
              onChange={(event) => {
                const next = [...items];
                next[index] = { ...item, isActive: event.target.checked };
                setItems(next);
              }}
              type="checkbox"
            />
            Bật
          </label>
        </div>
      ))}

      <button
        className="rounded-full bg-gradient-to-r from-pink-500 to-purple-500 px-6 py-3 text-sm font-semibold disabled:opacity-50"
        disabled={saving}
        onClick={save}
        type="button"
      >
        {saving ? "Đang lưu..." : "Lưu hoa hồng"}
      </button>
      {message ? <p className="rounded-xl border border-white/10 bg-white/[0.05] p-3 text-sm text-white/74">{message}</p> : null}
    </div>
  );
}
