# Repository rename audit

## Operation

- Operation ID: `repo-rename-2026-07-29-data-spectrum`
- Status: `prepared`
- Repository ID: `1305865066`
- Default branch: `main`
- Visibility: `public`
- Prepared at: `2026-07-29T07:25:03+08:00` (`2026-07-28T23:25:03Z`)
- Baseline commit: `3c7214b893c7418227f2222dc7e3d22769a54210`
- Old repository: `EasonXavier/DataSpectrum`
- New repository: `EasonXavier/data-spectrum`
- Old repository URL: `https://github.com/EasonXavier/DataSpectrum`
- New repository URL: `https://github.com/EasonXavier/data-spectrum`
- Old Pages URL: `https://easonx.me/DataSpectrum/`
- New Pages URL: `https://easonx.me/data-spectrum/`

## Preflight findings

- The Pages workflow uploads `site/` and contains no repository-name-dependent configuration.
- Application HTML, scripts, styles, and fonts use relative paths and do not require runtime changes.
- The README online URL must use the new Pages path.
- The `DataSpectrum` product name, page title, accessible labels, and CSS class names are brand text and remain unchanged by decision.
- No GitHub Actions consumer, submodule, package coordinate, raw-content URL, or API endpoint references this repository by its old name in the owner's other repositories.
- The owner chose a direct Pages cutover. The old project Pages URL is not retained by a compatibility redirect.

## Planned changes

1. Commit this audit and the README online URL update on `main`.
2. Rename the GitHub repository to `data-spectrum`.
3. Update `origin` to the new repository URL.
4. Append the actual rename time, commits, and verification evidence to this file.
5. Push the completion record, wait for the Pages workflow, and verify the new URL.

## Rollback

1. Rename the GitHub repository back to `DataSpectrum`.
2. Set `origin` to `https://github.com/EasonXavier/DataSpectrum.git`.
3. Restore the README online URL to `https://easonx.me/DataSpectrum/`.
4. Append a rollback event to this audit file; do not delete the audit history.
5. Commit and push the rollback record to `main`.
6. Wait for the Pages workflow and verify `https://easonx.me/DataSpectrum/` returns HTTP 200 and serves the application.

Do not create a new repository using the old name because doing so would break GitHub's repository redirect.
