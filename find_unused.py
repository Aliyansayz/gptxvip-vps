import os
import subprocess

def find_unused():
    src_dir = '/root/projects/gptxvip/src'
    dev_lush_dir = os.path.join(src_dir, 'devLushArea')
    
    # get all files in devLushArea
    all_files = []
    for root, dirs, files in os.walk(dev_lush_dir):
        for file in files:
            if file.endswith(('.ts', '.tsx', '.js', '.jsx', '.json', '.md', '.yaml', '.cjs')):
                all_files.append(os.path.join(root, file))
    
    unused_files = []
    
    for file_path in all_files:
        filename = os.path.basename(file_path)
        name, ext = os.path.splitext(filename)
        
        # for index files, search for the parent directory name
        if name == 'index':
            name = os.path.basename(os.path.dirname(file_path))
            
        # skip if name is empty
        if not name:
            continue
            
        # search for name in src
        try:
            # -F fixed string, -l list files, -q quiet
            result = subprocess.run(
                ['rg', '-F', '-l', name, src_dir],
                capture_output=True,
                text=True
            )
            # filter out the file itself
            matched_files = [f for f in result.stdout.strip().split('\n') if f and f != file_path]
            
            if not matched_files:
                unused_files.append(file_path)
                print(f'UNUSED: {file_path}')
        except Exception as e:
            print(f'Error processing {file_path}: {e}')
            
    print(f'Found {len(unused_files)} unused files.')
    with open('/root/projects/gptxvip/unused_files.txt', 'w') as f:
        for uf in unused_files:
            f.write(uf + '\n')

if __name__ == '__main__':
    find_unused()
