#!/usr/bin/python
""" Converts eiti csv to json """
import json
import csv
import sys

def main():
    """ main function """
    csv_conn = open('./health.csv', 'rU')
    csv_data = csv.reader(csv_conn, delimiter=',', quotechar="'")

    print sys.argv[0]

    year = {}
    json_data = []
    for row in csv_data:
        if row[0] != 'year':
            if row[4] == '':
                resource = 0
            else:
                resource = float(row[4])
            # if row[7] == '':
            #     export = 0
            # else:
            #     export = float(row[7])
            if row[6] == '':
                health = 0
            else:
                health = float(row[6])

            if row[0] not in year:
                json_data.append({
                    "name": "*Total",
                    "year": row[0],
                    "cats": [
                        {
                            "name": "Resource Revenues",
                            "value": resource
                        },
                        # {
                        #     "name": "Export Revenues",
                        #     "value": export
                        # },
                        {
                            "name": "Health Expenditures",
                            "value": health
                        },
                    ]
                })
                year[row[0]] = len(json_data)-1
            else:
                json_data.append({
                    "name": row[1].encode('utf-8'),
                    "year": row[0],
                    "cats": [
                        {
                            "name": "Resource Revenues",
                            "value": resource
                        },
                        # {
                        #     "name": "Export Revenues",
                        #     "value": export
                        # },
                        {
                            "name": "Health Expenditures",
                            "value": health
                        },
                    ]
                })
                json_data[year[row[0]]]["cats"][0]["value"] += resource
                # json_data[year[row[0]]]["cats"][1]["value"] += export
                json_data[year[row[0]]]["cats"][1]["value"] += health

    # write out archive of update into archive folder
    print_out = open('./health.json', 'w')
    print_out.write(json.dumps(json_data, indent=4, separators=(',', ':')))

if __name__ == "__main__":
    main()
    # main(sys.argv[1:])
