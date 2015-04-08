#!/usr/bin/python

import json
import csv

CSV_CONN = open('./health.csv', 'rU')
CSV_DATA = csv.reader(CSV_CONN, delimiter=',', quotechar="'")

YEAR = {}
JSON_DATA = []
for row in CSV_DATA:
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

        if row[0] not in YEAR:
            JSON_DATA.append({
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
            YEAR[row[0]] = len(JSON_DATA)-1
        else:
            JSON_DATA.append({
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
            JSON_DATA[YEAR[row[0]]]["cats"][0]["value"] += resource
            # JSON_DATA[year[row[0]]]["cats"][1]["value"] += export
            JSON_DATA[YEAR[row[0]]]["cats"][1]["value"] += health

# write out archive of update into archive folder
PRINT_OUT = open('./health.json', 'w')
PRINT_OUT.write(json.dumps(JSON_DATA, indent=4, separators=(',', ':')))
