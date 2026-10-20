#!/usr/bin/env python3
# ES TEAMS auto-push (safe version)
#
# Watches the project folder and pushes changes to GitHub.
# Safety rules (these fix the "<<<<<<< HEAD" deploy crash):
#   1. Never commits or pushes a file that contains git conflict markers.
#   2. If "git pull --rebase" hits a conflict, the rebase is aborted straight away,
#      so conflict markers are never left inside your files. Nothing is pushed.
#   3. If a rebase/merge is already in progress, it does nothing and tells you.
#   4. No secrets in this file: the Telegram token is read from the environment
#      variable PUSH_BOT_TOKEN, or from the file ~/.es_push_token (outside the repo).

import os
import re
import subprocess
import time
from datetime import datetime

REPO_PATH = os.environ.get(
    "REPO_PATH",
    "/data/data/com.termux/files/home/storage/shared/Download/TELEBOX",
)
BRANCH = "main"
REMOTE_URL = "https://github.com/esteamsx/telebot.git"
CHAT_ID = os.environ.get("PUSH_CHAT_ID", "5523737392")
TOKEN_FILE = os.path.expanduser("~/.es_push_token")

CODE_EXTS = (".js", ".mjs", ".cjs", ".json", ".py")
MARKER_RE = re.compile(rb"^(<{7,}( |$)|>{7,}( |$))", re.M)
ALERT_COOLDOWN = 600  # seconds between repeats of the same alert

_last_alert = {}


# -----------------------------
# Telegram notifications
# -----------------------------
def get_bot_token():
    token = os.environ.get("PUSH_BOT_TOKEN", "").strip()
    if token:
        return token
    try:
        with open(TOKEN_FILE, "r", encoding="utf-8") as f:
            return f.read().strip()
    except OSError:
        return ""


def send_telegram(message):
    token = get_bot_token()
    if not token:
        print("ℹ️ No push-bot token set, so no Telegram message was sent.")
        return
    try:
        import requests

        requests.post(
            f"https://api.telegram.org/bot{token}/sendMessage",
            data={"chat_id": CHAT_ID, "text": message},
            timeout=10,
        )
    except Exception as e:
        # Only the error type: the full message would contain the token inside the URL.
        print("Telegram error:", type(e).__name__)


def alert(key, message):
    """Print always; send to Telegram at most once per ALERT_COOLDOWN per reason."""
    print(message)
    now = time.time()
    if now - _last_alert.get(key, 0) >= ALERT_COOLDOWN:
        _last_alert[key] = now
        send_telegram(message)
    return key


# -----------------------------
# Git helpers
# -----------------------------
def remove_git_lock():
    lock = os.path.join(REPO_PATH, ".git", "index.lock")
    if os.path.exists(lock):
        try:
            os.remove(lock)
            print("🧹 Removed stale Git lock.")
        except Exception as e:
            print("Couldn't remove Git lock:", e)


def run_git(command, quiet=False):
    remove_git_lock()
    result = subprocess.run(
        command,
        cwd=REPO_PATH,
        capture_output=True,
        text=True,
    )
    if result.returncode != 0:
        if not quiet:
            print("❌ Git Error:", (result.stderr or result.stdout).strip())
        return None
    if not quiet:
        print("✅", " ".join(command))
    return result.stdout.strip()


def git_in_progress():
    """True if a rebase or merge is half-finished."""
    git_dir = os.path.join(REPO_PATH, ".git")
    return any(
        os.path.exists(os.path.join(git_dir, name))
        for name in ("rebase-merge", "rebase-apply", "MERGE_HEAD")
    )


def files_with_markers():
    """Code files that still contain '<<<<<<<' / '>>>>>>>' conflict markers."""
    listing = run_git(["git", "ls-files", "-c", "-o", "--exclude-standard"], quiet=True)
    if not listing:
        return []
    bad = []
    for rel in listing.splitlines():
        if not rel.lower().endswith(CODE_EXTS) or "node_modules/" in rel:
            continue
        path = os.path.join(REPO_PATH, rel)
        try:
            if os.path.getsize(path) > 20 * 1024 * 1024:
                continue
            with open(path, "rb") as f:
                if MARKER_RE.search(f.read()):
                    bad.append(rel)
        except OSError:
            continue
    return bad


def setup_repo():
    if not os.path.isdir(REPO_PATH):
        print("❌ Folder not found:", REPO_PATH)
        return False

    if not os.path.exists(os.path.join(REPO_PATH, ".git")):
        print("🔧 Initializing repo...")
        if run_git(["git", "init"]) is None:
            return False
        run_git(["git", "branch", "-M", BRANCH])

    # Only add the remote if it doesn't already exist
    if run_git(["git", "remote", "get-url", "origin"], quiet=True) is None:
        run_git(["git", "remote", "add", "origin", REMOTE_URL])

    # The script pushes to "main": rename the local branch if it has another name (e.g. "master").
    current = run_git(["git", "branch", "--show-current"], quiet=True)
    if current and current != BRANCH and not git_in_progress():
        run_git(["git", "branch", "-M", BRANCH])
    return True


# -----------------------------
# One sync cycle
# -----------------------------
def sync_once():
    """Returns a short status string (used for logs and tests)."""
    if git_in_progress():
        return alert(
            "in-progress",
            "⚠️ AUTO-PUSH PAUSED\n\nA git rebase/merge is half-finished in the project folder.\n"
            "Run: git rebase --abort   (or git merge --abort)   then save a file again.",
        )

    bad = files_with_markers()
    if bad:
        return alert(
            "markers",
            "⚠️ AUTO-PUSH BLOCKED\n\nConflict markers (<<<<<<<) found in: "
            + ", ".join(bad[:5])
            + "\nNothing was pushed. Replace/clean those files first.",
        )

    status = run_git(["git", "status", "--porcelain"], quiet=True)
    if status is None:
        return "git-error"
    if not status:
        return "clean"

    print("\n📁 Change detected!")

    # Stage everything except temporary/editor files.
    print("📌 Adding files...")
    if run_git([
        "git", "add", "-A", "--", ".",
        ":(exclude)*.tmp", ":(exclude)*.temp", ":(exclude)*.swp",
        ":(exclude)*~", ":(exclude).DS_Store",
    ]) is None:
        return "add-failed"

    staged = run_git(["git", "diff", "--cached", "--name-only"], quiet=True)
    if not staged:
        print("ℹ️ Nothing to commit.")
        return "nothing-staged"

    print("📝 Committing...")
    if run_git(["git", "commit", "-m", "𝗘𝗦 𝗧𝗘𝗔𝗠𝗦 𝗧𝗘𝗖𝗛"]) is None:
        return "commit-failed"

    # Pull latest GitHub changes. If this conflicts, undo it completely.
    print("📥 Pulling latest changes...")
    if run_git(["git", "pull", "--rebase", "origin", BRANCH]) is None:
        run_git(["git", "rebase", "--abort"], quiet=True)
        return alert(
            "pull-failed",
            "⚠️ AUTO-PUSH STOPPED\n\nGitHub has changes that clash with yours, so nothing was pushed.\n"
            "Your files were left exactly as they were (no conflict markers).",
        )

    # The pull itself may have brought markers in from GitHub.
    bad = files_with_markers()
    if bad:
        return alert(
            "markers-after-pull",
            "⚠️ AUTO-PUSH BLOCKED\n\nGitHub's copy already contains conflict markers in: "
            + ", ".join(bad[:5])
            + "\nNothing was pushed.",
        )

    print("🚀 Pushing to GitHub...")
    if run_git(["git", "push", "origin", f"HEAD:{BRANCH}"]) is None:
        return alert("push-failed", "⚠️ AUTO-PUSH: push to GitHub failed. Check the Termux window.")

    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    send_telegram(f"✅ PUSH SUCCESSFUL\n\n🕒 Time: {now}\n\n📂 Repository synced successfully.")
    print("📲 Telegram notification sent!")
    return "pushed"


# -----------------------------
# Main loop
# -----------------------------
def wait_for_change():
    try:
        subprocess.run(
            [
                "inotifywait", "-r", "-e", "modify,create,delete,move",
                "--exclude",
                r"(^|/)\.git(/|$)|(^|/)node_modules(/|$)|\.tmp$|\.temp$|\.swp$|~$|\.DS_Store$",
                ".",
            ],
            cwd=REPO_PATH,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
    except FileNotFoundError:
        time.sleep(5)  # inotify-tools missing: fall back to checking every 5 seconds


def main():
    print("🚀 Watching folder for changes...")
    if not setup_repo():
        print("❌ Failed to initialize repository.")
        raise SystemExit(1)

    while True:
        try:
            wait_for_change()
            time.sleep(2)  # let editors finish writing
            sync_once()
        except KeyboardInterrupt:
            print("\n🛑 Stopped.")
            break
        except Exception as e:
            print("🔥 ERROR:", e)
            send_telegram(f"❌ ERROR:\n{e}")
        time.sleep(1)


if __name__ == "__main__":
    main()
