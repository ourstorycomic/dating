import re
import glob
import os

components_dir = r"d:\dating\components\templates\dating-2\components"
files = glob.glob(os.path.join(components_dir, "Step*.tsx"))

for file in files:
    with open(file, "r", encoding="utf-8") as f:
        content = f.read()

    # Find the export function line
    match = re.search(r"export function (Step\w+)\(\{([^}]*)\}\s*:\s*\{([^}]*)\}\s*\)\s*\{", content)
    if match:
        func_name = match.group(1)
        args_str = match.group(2)
        types_str = match.group(3)
        
        # Check if customData is already there
        if "customData" not in args_str:
            new_args_str = args_str + ", customData = {}"
            new_types_str = types_str + ", customData?: any"
            
            new_line = f"export function {func_name}({{{new_args_str}}}: {{{new_types_str}}}) {{"
            
            # Replace the old line with the new line
            content = content[:match.start()] + new_line + content[match.end():]
            
            with open(file, "w", encoding="utf-8") as f:
                f.write(content)
            print(f"Updated {func_name} in {os.path.basename(file)}")

