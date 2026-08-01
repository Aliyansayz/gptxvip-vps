import os
import re

topics_dir = "/root/projects/gptxvip/src/devLushArea/devLushComponents/devLushTopics/"

# 1. Fix dark blue to light blue in OverviewActivity files
for root, dirs, files in os.walk(topics_dir):
    for f in files:
        if "OverviewActivity.tsx" in f:
            filepath = os.path.join(root, f)
            with open(filepath, 'r') as file:
                content = file.read()
            
            # Replace dark slate blues with lighter blues in diagrams
            new_content = content.replace('#1e293b', '#38bdf8')
            new_content = new_content.replace('#0f172a', '#7dd3fc')
            
            if new_content != content:
                with open(filepath, 'w') as file:
                    file.write(new_content)
                print(f"Updated colors in {filepath}")

