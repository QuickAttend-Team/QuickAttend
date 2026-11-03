# ==============================================================================
# QuickAttend - Script tu dong tao Milestone, Labels va 14 Issues cho Milestone 2
# Tuong thich hoan toan PowerShell 5.1 va PowerShell 7+
# ==============================================================================

[CmdletBinding()]
param(
    [Parameter(Mandatory = $true, Position = 0, HelpMessage = "Ten repo GitHub, vd: owner/repo")]
    [string]$Repo,

    [Parameter(Mandatory = $false, Position = 1, HelpMessage = "GitHub Personal Access Token (PAT)")]
    [string]$Token,

    [Parameter(Mandatory = $false)]
    [switch]$UseGh
)

$ErrorActionPreference = "Stop"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " [QUICKATTEND] TU DONG TAO ISSUES CHO MILESTONE 2" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "Repository: $Repo" -ForegroundColor Yellow

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$jsonPath = Join-Path $scriptDir "issues_data.json"

if (-not (Test-Path $jsonPath)) {
    Write-Error "Khong tim thay file du lieu: $jsonPath"
    exit 1
}

$rawJson = Get-Content -Path $jsonPath -Raw -Encoding UTF8
$issues = ConvertFrom-Json $rawJson

Write-Host "Da tai $($issues.Count) issues tu file json." -ForegroundColor Green

# -------------------------------------------------------------------------
# PHUONG THUC 1: SU DUNG GITHUB CLI (GH)
# -------------------------------------------------------------------------
if ($UseGh) {
    Write-Host "[INFO] Dang kiem tra GitHub CLI (gh)..." -ForegroundColor Cyan
    $ghCmd = Get-Command "gh" -ErrorAction SilentlyContinue
    if (-not $ghCmd) {
        Write-Error "Khong tim thay lenh 'gh'. Vui long cai GitHub CLI hoac dung che do Token."
        exit 1
    }

    Write-Host "[INFO] Dang kiem tra va tao Labels tren repo..." -ForegroundColor Cyan
    $labelsToEnsure = @(
        @{ Name = "ui/ux"; Color = "f39c12"; Description = "UI/UX Design and Figma mockups" },
        @{ Name = "frontend"; Color = "1abc9c"; Description = "Mobile frontend and client screens" },
        @{ Name = "backend"; Color = "3498db"; Description = "Server API and Database logic" },
        @{ Name = "devops"; Color = "34495e"; Description = "CI/CD and infrastructure setup" },
        @{ Name = "security"; Color = "e74c3c"; Description = "Authentication and hardware security" },
        @{ Name = "us-feature"; Color = "9b59b6"; Description = "Core MVP User Story implementation" },
        @{ Name = "enhancement"; Color = "a2eeef"; Description = "Resilience and performance improvements" },
        @{ Name = "testing"; Color = "d4c5f9"; Description = "Unit, integration, and field testing" },
        @{ Name = "qa"; Color = "0052cc"; Description = "Quality assurance" },
        @{ Name = "documentation"; Color = "0075ca"; Description = "Wiki, report, and documentation" }
    )

    foreach ($lbl in $labelsToEnsure) {
        & gh label create $lbl.Name --repo $Repo --color $lbl.Color --description $lbl.Description --force 2>$null
    }

    $count = 0
    foreach ($issue in $issues) {
        $count++
        $labelsArg = $issue.labels -join ","
        Write-Host "[$count/$($issues.Count)] Dang tao: $($issue.title)..." -ForegroundColor Yellow
        $result = & gh issue create --repo $Repo --title $issue.title --body $issue.body --label $labelsArg
        Write-Host "   [OK] $result" -ForegroundColor Green
        Start-Sleep -Milliseconds 600
    }

    Write-Host "[HOAN TAT] Da tao xong toan bo issues bang GitHub CLI!" -ForegroundColor Green
    exit 0
}

# -------------------------------------------------------------------------
# PHUONG THUC 2: SU DUNG GITHUB REST API (KHUYEN DUNG)
# -------------------------------------------------------------------------
if (-not $Token) {
    $Token = Read-Host "Vui long nhap GitHub Personal Access Token (PAT)"
    if (-not $Token) {
        Write-Error "Token khong duoc de trong!"
        exit 1
    }
}

$headers = @{
    "Authorization" = "Bearer $Token"
    "Accept"        = "application/vnd.github+json"
    "User-Agent"    = "QuickAttend-Issue-Creator"
    "X-GitHub-Api-Version" = "2022-11-28"
}

# 1. Kiem tra ket noi repo
Write-Host "[INFO] Dang kiem tra quyen truy cap repository: $Repo..." -ForegroundColor Cyan
try {
    $repoInfo = Invoke-RestMethod -Uri "https://api.github.com/repos/$Repo" -Method Get -Headers $headers
    Write-Host "   [OK] Ket noi thanh cong toi repo: $($repoInfo.full_name)" -ForegroundColor Green
} catch {
    Write-Host "[LOI] Khong the truy cap repository. Vui long kiem tra ten repo va token." -ForegroundColor Red
    Write-Error $_
    exit 1
}

# 2. Tao hoac lay Milestone 2
$milestoneTitle = "Milestone 2: UI/UX & Core Feature Implementation"
Write-Host "[INFO] Dang kiem tra Milestone: $milestoneTitle..." -ForegroundColor Cyan
$milestoneNumber = $null

try {
    $existingMilestones = Invoke-RestMethod -Uri "https://api.github.com/repos/$Repo/milestones?state=all" -Method Get -Headers $headers
    foreach ($m in $existingMilestones) {
        if ($m.title -eq $milestoneTitle -or $m.title -like "*Milestone 2*") {
            $milestoneNumber = $m.number
            Write-Host "   [OK] Tim thay Milestone so: $($milestoneNumber)" -ForegroundColor Yellow
            break
        }
    }

    if (-not $milestoneNumber) {
        $milestonePayload = @{
            title       = $milestoneTitle
            state       = "open"
            description = "Giai doan thiet ke Figma, setup khung ung dung Expo, hoan thien 8 User Stories va kiem thu tich hop."
        } | ConvertTo-Json -Compress

        $newMilestone = Invoke-RestMethod -Uri "https://api.github.com/repos/$Repo/milestones" -Method Post -Headers $headers -Body $milestonePayload
        $milestoneNumber = $newMilestone.number
        Write-Host "   [OK] Da tao moi Milestone so: $($milestoneNumber)" -ForegroundColor Green
    }
} catch {
    Write-Warning "Khong the tao Milestone (co the do thieu scope permissions). Tiep tuc tao issue khong gan milestone."
}

# 3. Tao labels
Write-Host "[INFO] Dang kiem tra va tao nhan (Labels)..." -ForegroundColor Cyan
$labelsToEnsure = @(
    @{ name = "ui/ux"; color = "f39c12"; description = "UI/UX Design and Figma mockups" },
    @{ name = "frontend"; color = "1abc9c"; description = "Mobile frontend and client screens" },
    @{ name = "backend"; color = "3498db"; description = "Server API and Database logic" },
    @{ name = "devops"; color = "34495e"; description = "CI/CD and infrastructure setup" },
    @{ name = "security"; color = "e74c3c"; description = "Authentication and hardware security" },
    @{ name = "us-feature"; color = "9b59b6"; description = "Core MVP User Story implementation" },
    @{ name = "enhancement"; color = "a2eeef"; description = "Resilience and performance improvements" },
    @{ name = "testing"; color = "d4c5f9"; description = "Unit, integration, and field testing" },
    @{ name = "qa"; color = "0052cc"; description = "Quality assurance" },
    @{ name = "documentation"; color = "0075ca"; description = "Wiki, report, and documentation" }
)

foreach ($lbl in $labelsToEnsure) {
    try {
        $lblPayload = @{
            name        = $lbl.name
            color       = $lbl.color
            description = $lbl.description
        } | ConvertTo-Json -Compress
        
        $null = Invoke-RestMethod -Uri "https://api.github.com/repos/$Repo/labels" -Method Post -Headers $headers -Body $lblPayload -ErrorAction Stop
    } catch {
        # Bo qua neu nhan da ton tai
    }
}
Write-Host "   [OK] He thong labels da san sang." -ForegroundColor Green

# 4. Tien hanh tao toan bo 14 Issues
Write-Host "[INFO] Dang tao $($issues.Count) issues len GitHub..." -ForegroundColor Cyan
$successCount = 0

for ($i = 0; $i -lt $issues.Count; $i++) {
    $item = $issues[$i]
    $issueNum = $i + 1

    Write-Host "[$issueNum/$($issues.Count)] Dang tao: $($item.title)... " -NoNewline -ForegroundColor Yellow

    $bodyPayload = @{
        title     = $item.title
        body      = $item.body
        labels    = $item.labels
    }

    if ($milestoneNumber) {
        $bodyPayload["milestone"] = $milestoneNumber
    }

    $jsonBody = [System.Text.Encoding]::UTF8.GetBytes(($bodyPayload | ConvertTo-Json -Depth 5 -Compress))

    try {
        $createdIssue = Invoke-RestMethod -Uri "https://api.github.com/repos/$Repo/issues" -Method Post -Headers $headers -Body $jsonBody -ContentType "application/json; charset=utf-8"
        Write-Host "[OK] Issue #$($createdIssue.number)" -ForegroundColor Green
        Write-Host "       URL: $($createdIssue.html_url)" -ForegroundColor DarkGray
        $successCount++
    } catch {
        Write-Host "[LOI]" -ForegroundColor Red
        Write-Warning $_.Exception.Message
    }

    # Nghi 600ms tranh Rate Limit
    Start-Sleep -Milliseconds 600
}

Write-Host ""
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " [THANH CONG] DA TAO $successCount/$($issues.Count) ISSUES CHO MILESTONE 2!" -ForegroundColor Green
Write-Host " Truy cap: https://github.com/$Repo/issues" -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Cyan
