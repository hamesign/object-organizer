[README.md](https://github.com/user-attachments/files/34056852/README.md)

# Object Organizer for Illustrator

An Adobe Illustrator ExtendScript that arranges selected objects in a grid on the active artboard. It includes a live preview, spacing and margin controls, cell numbering, checkerboard backgrounds, and optional logo color contrast settings.

> **Status:** Initial version for review. Test on a copy of your document and save your Illustrator file before running the script.

<img width="763" height="576" alt="Screenshot 2026-10-28 at 10 20 19 AM" src="https://github.com/user-attachments/assets/5fbeb0a9-4ef2-41a5-a723-a0981253b73f" />

<img width="2000" height="2000" alt="Prewiew" src="https://github.com/user-attachments/assets/a2bae7db-b911-41c8-9916-f63fc9bdec76" />

<img width="2000" height="2000" alt="Preview2" src="https://github.com/user-attachments/assets/48af069e-664a-4af6-8036-07b6d2c266d8" />

<img width="2000" height="2000" alt="Preview3" src="https://github.com/user-attachments/assets/985c6b01-8d4b-48d1-98e0-8ae69731b148" />


## Requirements

- Adobe Illustrator with support for running `.jsx` scripts.
- An open Illustrator document with the objects you want to arrange selected.

## How to use

1. Select the objects to place in the grid.
2. Run `Object organizer.jsx` from **File > Scripts > Other Script…** (the menu name may vary by Illustrator version or language).
3. Set the rows, columns, gutter, artboard margin, cell inset, numbering, and colors as needed.
4. Review the preview. Choose **Cancel** to discard it, or **OK** to replace the selected source objects with the grid.

Objects fill cells from left to right, then top to bottom. Each object is resized to fit its cell while preserving its proportions.

## Important notes

- Clicking **OK** removes the selected source objects after creating the final grid. Run the script on a copy and confirm the result before saving.
- **Cancel** is intended to restore the source objects. However, the preview hides the sources and creates temporary objects in the document, so test on a copy first.
- Auto-contrast recolors recognized paths, compound paths, groups, and text. This may remove their original colors or appearance. Other items, such as raster or placed artwork, may not be recolored.
- Rows and columns must be positive whole numbers, with a maximum grid capacity of 5,000 cells. Spacing, margins, offsets, number size, and hex color format are validated before the grid is created.
- If the selected object count exceeds the grid capacity, the script displays an error.
- The initial rows and columns are calculated from the selected object count to provide enough cells in a near-square layout. For example, 10 objects produce a 3 × 4 grid. You can still change the rows and columns manually.
- Cell numbering and live preview are enabled by default.
- The default cell inset is 1 mm.

## Privacy and security

An initial code review found no network access, data transmission, or file reading/writing. The script operates on the currently open Illustrator document and can modify its contents. Review the code and test it on a copy of your document before use.

## License

This project is licensed under the MIT License. See [`LICENSE`](LICENSE) for the full text. The MIT License permits use, modification, redistribution, and commercial use, including selling copies, provided the copyright and license notices are retained. Replace the copyright holder placeholder in `LICENSE` before publishing the repository. Also confirm that you have the rights to share the code and any third-party assets you include. Disclose AI assistance honestly if you wish or if applicable policies require it.

## Contributions and bug reports

When reporting an issue, include your Illustrator version, steps to reproduce it, expected and actual results, and a screenshot if useful. Remove personal information and client artwork from screenshots before sharing them.

## Review status

Code review notes and remaining limitations are in [`REVIEW.md`](REVIEW.md). Recent changes added input validation, safer preview failure handling, and cleanup of temporary groups when grid creation fails. The script has not been tested directly in Adobe Illustrator.

## AI disclosure: The script was generated with Google AI based on the repository owner’s instructions and reviewed by the owner.
