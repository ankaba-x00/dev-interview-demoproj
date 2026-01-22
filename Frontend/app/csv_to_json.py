import csv
import json

def conv_csv_to_json(csv_fpath, json_fpath):
    data = []

    with open(csv_fpath, mode="r", encoding="utf-8") as csv_file:
        reader = csv.DictReader(csv_file)
        for row in reader:
            data.append(row)

    with open(json_fpath, mode="w", encoding="utf-8") as json_file:
        json.dump(data, json_file, indent=4)

if __name__ == "__main__":
    import argparse
    from pathlib import Path

    parser = argparse.ArgumentParser(
        description="Convert CSV file to JSON file"
    )

    parser.add_argument(
        "csv_path",
        help="path to CSV file"
    )

    parser.add_argument(
        "json_name",
        nargs="?",
        help="name for JSON file"
    )

    args = parser.parse_args()

    csv_path = Path(args.csv_path)
    if args.json_name:
        json_path = Path(args.json_name)
    else:
        json_path = csv_path.with_suffix(".json")

    conv_csv_to_json(csv_path, json_path)
