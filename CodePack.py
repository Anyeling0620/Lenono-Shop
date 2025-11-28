import os

# 运行此文件获得该项目的目录树和文件内容，输出到 CodePackage.txt 中
# --- 配置 ---
PROJECT_ROOT = "."                  # 项目根目录，"." 代表当前目录
OUTPUT_FILE = "CodePackage.txt"     # 输出文件名
IGNORE_DIRS = {".git", "node_modules", "dist", "__pycache__", ".vscode"}                # 忽略的文件夹
IGNORE_FILES = {".DS_Store", "package-lock.json", "CodePackage.txt", "CodePack.py"}     # 忽略的文件
MAX_DEPTH = 5                       # 最大深度    


def generate_project_context(root_dir, output_file):
    with open(output_file, "w", encoding="utf-8") as f:
        f.write("### PROJECT STRUCTURE ###\n")

        # 1. 生成文件结构树
        for root, dirs, files in os.walk(root_dir):
            # 忽略指定目录
            dirs[:] = [d for d in dirs if d not in IGNORE_DIRS]

            level = root.replace(root_dir, '').count(os.sep)
            if level >= MAX_DEPTH:
                dirs[:] = []  # 不再深入
                continue

            indent = ' ' * 4 * (level)
            f.write(f"{indent}{os.path.basename(root)}/\n")
            sub_indent = ' ' * 4 * (level + 1)
            for file in files:
                if file not in IGNORE_FILES:
                    f.write(f"{sub_indent}{file}\n")
        f.write("\n\n\n===============================================================\n===============================================================\n===============================================================\n\n\n")
        f.write("\n\n### FILE CONTENTS ###\n")

        # 2. 读取并写入文件内容
        for root, dirs, files in os.walk(root_dir):
            dirs[:] = [d for d in dirs if d not in IGNORE_DIRS]

            level = root.replace(root_dir, '').count(os.sep)
            if level >= MAX_DEPTH:
                continue

            for file in files:
                if file in IGNORE_FILES:
                    continue

                file_path = os.path.join(root, file)
                try:
                    with open(file_path, "r", encoding="utf-8") as content_file:
                        content = content_file.read()
                        f.write(f"\n--- FILE: {file_path} ---\n")
                        f.write(f"```{os.path.splitext(file)[1].lstrip('.')}\n")
                        f.write(content)
                        f.write("\n```\n")
                except Exception as e:
                    f.write(f"\n--- FILE: {file_path} (could not read) ---\n")
                    f.write(f"Error: {e}\n")


if __name__ == "__main__":
    generate_project_context(PROJECT_ROOT, OUTPUT_FILE)
    print(f"Project context has been written to {OUTPUT_FILE}")