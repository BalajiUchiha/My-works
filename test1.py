import pandas as pd

# Load the dataset
url = "https://people.sc.fsu.edu/~jburkardt/data/csv/airtravel.csv"
df = pd.read_csv(url)

# Expanded dictionary to cover all typical user inputs
month_map = {
    'january': 'JAN', 'jan': 'JAN', 'JANUARY': 'JAN', 'JAN': 'JAN',
    'february': 'FEB', 'feb': 'FEB', 'FEBRUARY': 'FEB', 'FEB': 'FEB',
    'march': 'MAR', 'mar': 'MAR', 'MARCH': 'MAR', 'MAR': 'MAR',
    'april': 'APR', 'apr': 'APR', 'APRIL': 'APR', 'APR': 'APR',
    'may': 'MAY', 'MAY': 'MAY',
    'june': 'JUN', 'jun': 'JUN', 'JUNE': 'JUN', 'JUN': 'JUN',
    'july': 'JUL', 'jul': 'JUL', 'JULY': 'JUL', 'JUL': 'JUL',
    'august': 'AUG', 'aug': 'AUG', 'AUGUST': 'AUG', 'AUG': 'AUG',
    'september': 'SEP', 'sep': 'SEP', 'SEPTEMBER': 'SEP', 'SEP': 'SEP',
    'october': 'OCT', 'oct': 'OCT', 'OCTOBER': 'OCT', 'OCT': 'OCT',
    'november': 'NOV', 'nov': 'NOV', 'NOVEMBER': 'NOV', 'NOV': 'NOV',
    'december': 'DEC', 'dec': 'DEC', 'DECEMBER': 'DEC', 'DEC': 'DEC'
}

# Ask user for input
user_input = input("Enter the month (e.g., January, jan, JANUARY, etc.): ").strip()

# Try to convert input to correct month abbreviation
month_abbr = month_map.get(user_input)

if month_abbr:
    # Find the row for the given month
    result = df[df['Month'] == month_abbr]
    if not result.empty:
        print(result)
    else:
        print("Month not found in data.")
else:
    print("Invalid month input.")