import re
import os

with open('components/templates/WillYouDateMeExperience.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove global css imports
content = content.replace('import "@/app/animations.css";\n', '')
content = content.replace('import "@/app/templates.css";\n', '')

# Remove components from the bottom
# The components start with // Mây trôi bồng bềnh
idx = content.find('// Mây trôi bồng bềnh')
if idx != -1:
    content = content[:idx]

# Add imports for components
imports = """
import { FloatingClouds } from "./components/FloatingClouds";
import { HeartBurst } from "./components/HeartBurst";
import { FloatingHearts3D } from "./components/FloatingHearts3D";
import { GlowingDust } from "./components/GlowingDust";
import { CuteDatePicker } from "./components/CuteDatePicker";
import { CuteTimePicker } from "./components/CuteTimePicker";
"""

# insert imports after framer-motion
import_idx = content.find('import { motion, AnimatePresence } from "framer-motion";')
if import_idx != -1:
    end_of_line = content.find('\n', import_idx) + 1
    content = content[:end_of_line] + imports + content[end_of_line:]

with open('components/templates/dating-1/Experience.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

os.remove('components/templates/WillYouDateMeExperience.tsx')
os.remove('components/templates/previews/WillYouDateMePreview.tsx')

# update index.tsx
with open('components/templates/dating-1/index.tsx', 'w', encoding='utf-8') as f:
    f.write('export { WillYouDateMeExperience } from "./Experience";\n')

print("Done")
