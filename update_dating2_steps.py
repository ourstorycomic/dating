import os
import re

components_dir = r"d:\dating\components\templates\dating-2\components"

files = [
    "Step1Login.tsx",
    "Step1_5Radio.tsx",
    "Step2Vibe.tsx",
    "Step3Scratch.tsx",
    "Step4Wheel.tsx",
    "Step5DateTime.tsx",
    "Step6Finale.tsx"
]

for filename in files:
    path = os.path.join(components_dir, filename)
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    # Change function signature to accept customData
    # export function Step1Login({ onNext }: any) {
    # -> export function Step1Login({ onNext, customData = {} }: any) {
    if "customData = {}" not in content:
        content = re.sub(
            r"(export function \w+\(.*?)(\): any) {",
            r"\1, customData = {} \2 {",
            content
        )
        content = re.sub(
            r"(export function \w+\({.*?)(} ?: any\s*{)",
            r"\1, customData = {} \2",
            content
        )

    # Replace TPL_DATA.xxx with (customData.xxx || TPL_DATA.xxx)
    # Be careful not to replace it if it's already replaced
    # Let's find all unique TPL_DATA keys used
    keys = re.findall(r"TPL_DATA\.(\w+)", content)
    unique_keys = set(keys)
    for key in unique_keys:
        # replace TPL_DATA.key with (customData.key || TPL_DATA.key)
        # but only if not already wrapped
        content = re.sub(rf"(?<!customData\.{key} \|\| )TPL_DATA\.{key}", f"(customData.{key} || TPL_DATA.{key})", content)

    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

print("Updated all steps to accept customData")
