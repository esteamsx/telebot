import os
import time
from datetime import datetime
import requests
import subprocess

# -----------------------------
# Paths
# -----------------------------
REPO_PATH = "/data/data/com.termux/files/home/storage/shared/Download/TELEBOX"
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
        cwd=REPO_PATH,
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
    if not os.path.exists(os.path.join(REPO_PATH, ".git")):
        print("🔧 Initializing repo...")
        if run_git(["git", "init"]) is None:
            return False
        run_git(["git", "branch", "-M", "main"])
        remote_check = subprocess.run(
            ["git", "remote", "get-url", "origin"],
            cwd=REPO_PATH,
            capture_output=True,
            text=True
        )
        if remote_check.returncode != 0:
            run_git([
                "git", "remote", "add", "origin",
                "https://github.com/esteamsx/telebot.git"
            ])
    return True

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
    return run_git([
        "git", "add", "-A", "--", ".",
        ":(exclude)*.tmp",
        ":(exclude)*.temp",
        ":(exclude)*.swp",
        ":(exclude)*~",
        ":(exclude).DS_Store"
    ])

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

if not setup_repo():
    print("❌ Failed to initialize repository.")
    raise SystemExit(1)

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
                r"(^|/)\.git(/|$)|\.tmp$|\.temp$|\.swp$|~$|\.DS_Store$",
                "."
            ],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL
        )

        # Prevent multiple Git operations at once.
        if git_running:
            continue
        git_running = True

        # Give applications/editors time to finish writing files.
        time.sleep(2)
        status = git_status()
        if status is None:
            git_running = False
            continue
        if not status:
            git_running = False
            continue

        print("\n📁 Change detected!")
        if git_add() is None:
            git_running = False
            continue

        staged = run_git(["git", "diff", "--cached", "--name-only"])
        if staged is None or not staged:
            print("ℹ️ Nothing to commit.")
            git_running = False
            continue

        commit = git_commit()
        if commit is None:
            git_running = False
            continue

        # Pull latest GitHub changes.
        if git_pull() is None:
            git_running = False
            continue

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
