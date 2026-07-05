import os
import time
from datetime import datetime
import requests
import subprocess

# -----------------------------
# Paths
# -----------------------------
REPO_PATH = "/data/data/com.termux/files/home/storage/shared/Download/TELEBOTX"
os.chdir(REPO_PATH)

# -----------------------------
# Telegram info
# -----------------------------
BOT_TOKEN = "8508854111:AAFgaTRtQkQwzhyFVXbMtMYqF0o5N5xS-OM"
CHAT_ID = "5523737392"

def send_telegram(message):
    try:
        requests.post(
            f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage",
            data={"chat_id": CHAT_ID, "text": message}
        )
    except Exception as e:
        print("Telegram error:", e)

# -----------------------------
# Git command runner
# -----------------------------
def run_git(command):
    result = subprocess.run(command, capture_output=True, text=True)
    if result.returncode != 0:
        print("❌ Git Error:", result.stderr)
    else:
        print("✅", " ".join(command))
    return result.stdout.strip()

# -----------------------------
# Setup repo (runs once)
# -----------------------------
def setup_repo():
    if not os.path.exists(".git"):
        print("🔧 Initializing repo...")
        run_git(["git", "init"])
        run_git(["git", "branch", "-M", "main"])
        run_git(["git", "remote", "add", "origin", "https://github.com/esteamsx/telebot.git"])

# -----------------------------
# Git functions
# -----------------------------
def git_pull():
    print("📥 Pulling latest changes...")
    return run_git(["git", "pull", "--rebase", "origin", "main"])

def git_add():
    print("📌 Adding files...")
    return run_git(["git", "add", "."])

def git_commit():
    print("📝 Committing...")
    return run_git(["git", "commit", "-m", "𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗧𝗘𝗖𝗛"])

def git_push():
    print("🚀 Pushing to GitHub...")
    return run_git(["git", "push", "origin", "main"])

def git_status():
    return run_git(["git", "status", "--porcelain"])

# -----------------------------
# Main loop (fixed)
# -----------------------------
print("🚀 Watching folder for changes...")

setup_repo()

while True:
    try:
        # Wait for file changes, ignore temporary/backup files
        subprocess.run(
            ["inotifywait", "-r", "-e", "modify,create,delete,move", "--exclude", r'\.swp$|\.tmp$|~$|\.DS_Store', "."],
            stdout=subprocess.DEVNULL
        )

        # Check for actual changes first
        status = git_status()
        if not status:
            continue  # skip if nothing really changed

        print("\n📁 Change detected!")

        # Stage files
        git_add()

        # Commit if there’s something to commit
        commit_output = git_commit()
        if "nothing to commit" in commit_output.lower():
            continue

        # Pull latest from GitHub after committing
        git_pull()

        # Push local commits
        git_push()

        # Telegram notification
        now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        status_after = git_status()
        msg = f"""✅ PUSH SUCCESSFUL

🕒 Time: {now}

📂 Changes:
{status_after if status_after else "All files committed"}
"""
        send_telegram(msg)
        print("📲 Telegram notification sent!")

    except Exception as e:
        print("🔥 ERROR:", e)
        send_telegram(f"❌ ERROR:\n{str(e)}")

    time.sleep(1)
