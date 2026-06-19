import sys
import re

with open(r"d:\dating\components\templates\birthday-1\index.tsx", "r", encoding="utf-8") as f:
    content = f.read()

old_block = """          <color attach="background" args={[phase === "vintage-gallery" || phase === "end" ? "#1a0f05" : isBright ? "#ffdff2" : "#16081d"]} />"""
new_block = """          {/* ÉP NỀN ĐEN 100% LÚC QUẸT DIÊM VÀ ƯỚC */}
          <color attach="background" args={[phase === "match-ignite" || phase === "wish-record" ? "#000000" : phase === "vintage-gallery" || phase === "end" ? "#1a0f05" : isBright ? "#ffdff2" : "#16081d"]} />"""

content = content.replace(old_block, new_block)

with open(r"d:\dating\components\templates\birthday-1\index.tsx", "w", encoding="utf-8") as f:
    f.write(content)
