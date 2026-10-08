# Builds the clean version of the prototypes into ..\clean from the working files.
# Clean = only the new UI/UX: no notes about what changed, no demo controls except the Current / Enhanced switch.
# Run again after editing any source prototype:  powershell -ExecutionPolicy Bypass -File tools\build-clean.ps1

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$out  = Join-Path $root 'clean'
New-Item -ItemType Directory -Force -Path $out | Out-Null
$enc = New-Object System.Text.UTF8Encoding $false

# source file -> clean file name (the all-courses page becomes the entry point)
$map = [ordered]@{
  'atlas-courses-prototype.html'       = 'index.html'
  'atlas-course-page-prototype.html'   = 'course.html'
  'atlas-lesson-blocks-prototype.html' = 'lesson.html'
}
$neutralToast = 'Not available in this preview'

foreach ($src in $map.Keys) {
  $t = [IO.File]::ReadAllText((Join-Path $root $src), $enc)
  $report = @()

  function Apply([string]$name, [string]$pattern, [string]$replacement) {
    $before = $script:t
    $script:t = [regex]::Replace($script:t, $pattern, $replacement, [System.Text.RegularExpressions.RegexOptions]::Singleline)
    if ($script:t -ne $before) { $script:report += $name }
  }

  # 1. Links between the pages follow the clean file names
  foreach ($k in $map.Keys) { $t = $t.Replace($k, $map[$k]) }

  # 2. Page titles without the word "Prototype"
  Apply 'titles' 'ATLAS (All Courses|Course Page|Lesson Blocks) Prototype' 'ATLAS Learn'

  # 3. The top bar keeps only the Current / Enhanced switch
  Apply 'progress switch' '\s*<div class="seg" role="group" aria-label="[^"]*[Pp]rogress">.*?</div>' ''
  Apply 'lesson switch'   '\s*<div class="seg" role="group" aria-label="Lesson">.*?</div>' ''
  Apply 'reset button'    '<button class="seg" id="resetBtn"[^>]*>Reset progress</button>' '<button id="resetBtn" type="button" hidden style="display:none">Reset progress</button>'

  # 4. Notes and labels that explain the current layout
  Apply 'current-layout labels' '<span class="legacy-tag">[^<]*</span>' ''
  Apply 'courses note'    "h \+= '<div class=""cur-note"">.*?</ul></div></div>';" "h += '</div>';"
  Apply 'course page note' "'<p class=""cur-note"">.*?</p></div>';" "'</div>';"

  # 5. Toasts that describe the prototype itself
  Apply 'attribute toasts' 'data-toast="[^"]*(in production|not part of)[^"]*"' ('data-toast="' + $neutralToast + '"')
  Apply 'persona note'     ' Saved in this browser only in the prototype\.' ''
  Apply 'script toasts'    "toast\('[^']*(as in production|\(prototype\))[^']*'\)" ("toast('" + $neutralToast + "')")
  Apply 'lesson toasts'    " is not part of this prototype" " is not available in this preview"

  # 6. A fresh walkthrough in every browser session: keep lesson progress in sessionStorage
  if ($src -eq 'atlas-lesson-blocks-prototype.html') { Apply 'session storage' 'localStorage' 'sessionStorage' }

  # 7. The Current / Enhanced choice follows the learner from page to page (runs before the page script reads the URL)
  $carry = @'
<script>
/* Keep the Current / Enhanced choice when moving between pages. */
(function () {
  try {
    var p = new URLSearchParams(location.search), saved = sessionStorage.getItem('atlas-mode');
    if (!p.get('mode') && saved) { p.set('mode', saved); history.replaceState(null, '', location.pathname + '?' + p.toString() + location.hash); }
    document.addEventListener('click', function (e) { var b = e.target.closest && e.target.closest('[data-mode]'); if (b) sessionStorage.setItem('atlas-mode', b.dataset.mode); });
  } catch (e) { /* storage unavailable: every page simply uses its default */ }
})();
</script>

'@
  $at = $t.IndexOf("`n<script>`n")
  if ($at -lt 0) { throw "no main <script> found in $src" }
  $t = $t.Insert($at + 1, $carry.Replace("`r`n", "`n"))
  $report += 'mode carry-over'

  [IO.File]::WriteAllText((Join-Path $out $map[$src]), $t, $enc)
  '{0,-38} -> clean\{1,-12} {2,4} KB   [{3}]' -f $src, $map[$src], [math]::Round((Get-Item (Join-Path $out $map[$src])).Length / 1KB), ($report -join ', ')
}
