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

# -----------------------------
# Telegram sender
# -----------------------------
def send_telegram(message):
    try:
        requests.post(
            f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage",
            data={"chat_id": CHAT_ID, "text": message},
            timeout=10
        )
    except Exception as e:
        print("Telegram error:", e)

# -----------------------------
# Remove stale git lock
# -----------------------------
def remove_git_lock():
    lock = os.path.join(REPO_PATH, ".git", "index.lock")
    if os.path.exists(lock):
        try:
            os.remove(lock)
            print("🧹 Removed stale Git lock.")
        except Exception as e:
            print("Couldn't remove Git lock:", e)

# -----------------------------
# Git command runner
# -----------------------------
def run_git(command):
    remove_git_lock()

    result = subprocess.run(
        command,
        capture_output=True,
        text=True
    )

    if result.returncode != 0:
        print("❌ Git Error:", result.stderr.strip())
        return None

    print("✅", " ".join(command))
    return result.stdout.strip()

# -----------------------------
# Setup repo
# -----------------------------
def setup_repo():
    if not os.path.exists(".git"):
        print("🔧 Initializing repo...")
        run_git(["git", "init"])
        run_git(["git", "branch", "-M", "main"])
        run_git([
            "git",
            "remote",
            "add",
            "origin",
            "https://github.com/esteamsx/telebot.git"
        ])

# -----------------------------
# Git helpers
# -----------------------------
def git_status():
    return run_git(["git", "status", "--porcelain"])

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

# -----------------------------
# Main
# -----------------------------
print("🚀 Watching folder for changes...")

setup_repo()

git_running = False

while True:
    try:
        subprocess.run(
            [
                "inotifywait",
                "-r",
                "-e",
                "modify,create,delete,move",
                "--exclude",
                r"(^|/)\.git(/|$)|\.swp$|\.tmp$|~$|\.DS_Store",
                "."
            ],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL
        )

        # Prevent multiple Git operations at once
        if git_running:
            continue

        git_running = True

        # Give editors a moment to finish writing
        time.sleep(2)

        status = git_status()

        if not status:
            git_running = False
            continue

        print("\n📁 Change detected!")

        # Stage
        if git_add() is None:
            git_running = False
            continue

        # Commit
        commit = git_commit()

        if commit is None:
            git_running = False
            continue

        committed = "nothing to commit" not in commit.lower()

        # Pull (rebase) now that the working tree is clean
        if git_pull() is None:
            git_running = False
            continue

        if not committed:
            git_running = False
            continue

        # Push
        if git_push() is None:
            git_running = False
            continue

        now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        send_telegram(
            f"""✅ PUSH SUCCESSFUL

🕒 Time: {now}

📂 Repository synced successfully.
"""
        )

        print("📲 Telegram notification sent!")

        git_running = False

    except KeyboardInterrupt:
        print("\n🛑 Stopped.")
        break

    except Exception as e:
        git_running = False
        print("🔥 ERROR:", e)
        send_telegram(f"❌ ERROR:\n{e}")

    time.sleep(1)
