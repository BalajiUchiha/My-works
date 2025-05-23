# Air Travel Monthly Data Viewer

This Python program fetches live CSV data from a public URL and
allows the user to access airline passenger traffic by month.
The user can input any month in various formats (e.g., jan, JANUARY, January) and get the corresponding data row.

---

## Features

-  Live Data Fetching: Automatically downloads airline travel data from a real website.
-  Flexible Input: Accepts user input for months in multiple formats.
-  Error Handling: Prevents crashes on invalid input.
-  Tabular Display: Neatly shows the number of passengers for three years (1958, 1959, 1960).

---

## Example

```bash
Enter the month (e.g., January, jan, JANUARY, etc.): jan
  Month  "1958"  "1959"  "1960"
0   JAN    340    360    417