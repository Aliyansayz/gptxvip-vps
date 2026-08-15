import os
import re

base_dir = os.path.abspath("/root/projects/gptxvip/src")
target_dir = os.path.join(base_dir, "components")
new_dir = os.path.join(base_dir, "finhub")

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    def replacer(match):
        quote = match.group(1)
        path_str = match.group(2)
        
        # Exact match or starts with...
        if path_str == 'src/components':
            return f"{quote}src/finhub{quote}"
        elif path_str.startswith('src/components/'):
            new_path = "src/finhub/" + path_str[len("src/components/"):]
            return f"{quote}{new_path}{quote}"
            
        if path_str.startswith('.') or path_str.startswith('/'):
            file_dir = os.path.dirname(filepath)
            abs_path = os.path.normpath(os.path.join(file_dir, path_str))
            
            # If the path points exactly to the components directory
            if abs_path == target_dir:
                parts = path_str.split('/')
                # Find the rightmost 'components' since the resolution ends there
                for i in range(len(parts)-1, -1, -1):
                    if parts[i] == 'components':
                        parts[i] = 'finhub'
                        break
                new_path_str = '/'.join(parts)
                return f"{quote}{new_path_str}{quote}"
            
            # If the path points into the components directory
            elif abs_path.startswith(target_dir + os.sep):
                parts = path_str.split('/')
                # The 'components' part that matches target_dir is the one where path enters it
                # We can just replace the first 'components' from the right that matches the structure?
                # Actually, if we just resolve path from file_dir, 'components' must be one of the parts.
                # Just replace the rightmost 'components' before the file's own relative path into it.
                # For safety, let's just find the first 'components' from left to right after any '.' or '..'
                for i in range(len(parts)):
                    if parts[i] == 'components':
                        # Check if replacing THIS 'components' with 'finhub' results in correct new_dir resolution
                        test_parts = parts[:]
                        test_parts[i] = 'finhub'
                        test_path = '/'.join(test_parts)
                        test_abs = os.path.normpath(os.path.join(file_dir, test_path))
                        if test_abs.startswith(new_dir + os.sep) or test_abs == new_dir:
                            parts[i] = 'finhub'
                            break
                new_path_str = '/'.join(parts)
                return f"{quote}{new_path_str}{quote}"
                
        return match.group(0)

    # regex to match strings in quotes (single, double, or backticks)
    new_content = re.sub(r'([\'"`])(.*?)\1', replacer, content)
    
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated: {filepath}")

for root, dirs, files in os.walk(base_dir):
    for file in files:
        if file.endswith((".ts", ".tsx", ".md", ".json", ".css", ".js", ".jsx", ".html")):
            process_file(os.path.join(root, file))

if os.path.exists(target_dir):
    os.rename(target_dir, new_dir)
    print(f"Renamed directory {target_dir} to {new_dir}")
