#!/usr/bin/env bash
# ==============================================================================
# QuickAttend - Script tạo tự động 14 Issues cho Milestone 2 trên GitHub
# Hỗ trợ Git Bash, Linux, macOS
# Cách dùng:
#   chmod +x ./scripts/create_issues.sh
#   ./scripts/create_issues.sh -r "owner/repo" -t "ghp_xxxxxxxxxxxx"
# ==============================================================================

set -e

REPO=""
TOKEN=""
USE_GH=false

while [[ "$#" -gt 0 ]]; do
    case $1 in
        -r|--repo) REPO="$2"; shift ;;
        -t|--token) TOKEN="$2"; shift ;;
        --gh) USE_GH=true ;;
        -h|--help)
            echo "Cách sử dụng:"
            echo "  $0 -r <owner/repo> -t <github_pat_token>"
            echo "  $0 -r <owner/repo> --gh"
            exit 0
            ;;
        *) echo "Tham số không hợp lệ: $1"; exit 1 ;;
    esac
    shift
done

if [ -z "$REPO" ]; then
    echo "❌ Lỗi: Vui lòng truyền tên repo (-r owner/repo)"
    exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
JSON_PATH="$SCRIPT_DIR/issues_data.json"

if [ ! -f "$JSON_PATH" ]; then
    echo "❌ Lỗi: Không tìm thấy file $JSON_PATH"
    exit 1
fi

if [ "$USE_GH" = true ]; then
    echo "⚙️ Đang sử dụng GitHub CLI (gh)..."
    which gh > /dev/null || (echo "❌ Không tìm thấy 'gh'. Vui lòng cài GitHub CLI." && exit 1)

    node -e '
        const fs = require("fs");
        const issues = JSON.parse(fs.readFileSync(process.argv[1], "utf8"));
        console.log(JSON.stringify(issues));
    ' "$JSON_PATH" | jq -c '.[]' | while read -r item; do
        TITLE=$(echo "$item" | jq -r '.title')
        BODY=$(echo "$item" | jq -r '.body')
        LABELS=$(echo "$item" | jq -r '.labels | join(",")')
        echo "Creating: $TITLE..."
        gh issue create --repo "$REPO" --title "$TITLE" --body "$BODY" --label "$LABELS"
        sleep 0.5
    done
    echo "🎉 Đã tạo xong toàn bộ issues!"
    exit 0
fi

if [ -z "$TOKEN" ]; then
    read -rsp "🔑 Nhập GitHub Personal Access Token: " TOKEN
    echo ""
fi

echo "🔍 Kiểm tra kết nối tới repo $REPO..."
curl -s -H "Authorization: Bearer $TOKEN" "https://api.github.com/repos/$REPO" | grep -q '"full_name"' || (echo "❌ Không thể truy cập repo hoặc Token sai." && exit 1)

echo "🚩 Kiểm tra/tạo Milestone 2..."
MILESTONE_NUM=$(curl -s -H "Authorization: Bearer $TOKEN" "https://api.github.com/repos/$REPO/milestones?state=all" | jq -r '.[] | select(.title | contains("Milestone 2")) | .number' | head -n 1)

if [ -z "$MILESTONE_NUM" ]; then
    MILESTONE_NUM=$(curl -s -X POST -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
        -d '{"title":"Milestone 2: UI/UX & Core Feature Implementation","state":"open"}' \
        "https://api.github.com/repos/$REPO/milestones" | jq -r '.number')
fi
echo "✅ Milestone 2 ID: #$MILESTONE_NUM"

TOTAL=$(jq '. | length' "$JSON_PATH")
echo "📝 Đang tạo $TOTAL issues..."

for i in $(seq 0 $(($TOTAL - 1))); do
    TITLE=$(jq -r ".[$i].title" "$JSON_PATH")
    BODY=$(jq -r ".[$i].body" "$JSON_PATH")
    LABELS=$(jq -c ".[$i].labels" "$JSON_PATH")

    PAYLOAD=$(jq -n \
        --arg title "$TITLE" \
        --arg body "$BODY" \
        --argjson labels "$LABELS" \
        --argjson milestone "$MILESTONE_NUM" \
        '{title: $title, body: $body, labels: $labels, milestone: $milestone}')

    echo "[$((i + 1))/$TOTAL] Đang tạo: $TITLE"
    curl -s -X POST -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
        -d "$PAYLOAD" "https://api.github.com/repos/$REPO/issues" > /dev/null
    sleep 0.6
done

echo "🎉 HOÀN THÀNH TOÀN BỘ ISSUES TRÊN GITHUB!"

