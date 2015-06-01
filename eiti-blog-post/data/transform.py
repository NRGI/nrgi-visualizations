#!/usr/bin/python
""" Converts eiti csv to json """
import json
import csv
import sys
import pycountry

# Report ID
# Years Covered
# Country Name
# Commodity
# Payments Received by Government from Covered Companies (US$)
# Payments Made by Covered Companies (US$)
# Total GDP US$ nominal
# Total GDP US$ nominal
# Population,Extractive revenues (% GDP)
# "Revenue, excluding grants (% GDP)"
# "Revenue, excluding grants"
# Total government revenues (US$)
# Extractive revenues (%  revenues excluding grants)
# "Extractive exports (US$), UNCTAD"
# "Total exports (US$), UNCTAD"
# Extractive exports (% total exports)
# ODA (US$)
# Extractive revenues (% ODA)
# "Health expenditure, public (% of GDP)"
# Health expenditure (US$)
# Extractive revenues (% health budget)
# Public spending on education (% of GDP) 
# Public spending (US$)
# Extractive revenues (% education budget)
# TI Corruption Perception Index
# Poverty Headcount (%pop) - WB
# Life expectancy at birth - WB
# Infant mortality - WB
# Primary school enrolment - WB
# RGI score (2010)
# RGI score (2013)
# Voice and Accountability WGI score
# Political Stability WGI score
# Government Effectiveness WGI score
# Regulatory Quality WGI score
# Control of Corruption WGI score

def main(args):
    """ main function """
    with open('./eitidata.csv', 'rU') as f:
        csv_reader = csv.reader(f, delimiter=',', quotechar='"')

        header = next(csv_reader)
        lkey = { 
            str(header[i]).replace("text:u", "")
                .replace("'", ""): i for i in range(0, len(header)) 
            }

        comp = args[0]
        file_name = args[1].lower()

        current_report = 'none'
        year_list = {}
        json_data = []

        for row in csv_reader:
            if row[0] == current_report:
                pass
            else:
                year = row[lkey['Years Covered']]
                country = row[lkey['Country Name']]

                if country == "C\x93te d'Ivoire":
                    country = "Cote d'Ivoire"
                    country_id = 'CIV'
                elif country == "C\xd2te d'Ivoire":
                    country = "Cote d'Ivoire"
                    country_id = 'CIV'
                elif country == 'Democratic Republic of Congo':
                    country_id = 'COD'
                elif country == 'Kyrgyz Republic':
                    country_id = 'KGZ'
                elif country == 'Republic of the Congo':
                    country_id = 'COG'
                elif country == 'Tanzania':
                    country_id = 'TZA'
                else:
                    country_id = pycountry.countries.get(name=country).alpha3
                # print country + ' ' + year

                resource = float(row[lkey['Payments Received by Government from Covered Companies (US$)']])
                if row[lkey[comp]] == '' or row[lkey[comp]] == '..' or row[lkey[comp]] == '#N/A':
                    comp_val = 0
                else:
                    comp_val = float(row[lkey[comp]])

                if year not in year_list:
                    json_data.append({
                        "name": "*Total",
                        "id": 'all',
                        "year": year,
                        "cats": [
                            {
                                "name": "Resource revenues (US$)",
                                "value": resource
                            },
                            {
                                "name": comp,
                                "value": comp_val

                            }
                        ]
                    })
                    year_list[year] = len(json_data)-1
                    json_data.append({
                        "name": country,
                        'id': country_id,
                        "year": year,
                        "cats": [
                            {
                                "name": "Resource revenues (US$)",
                                "value": resource
                            },
                            {
                                "name": comp,
                                "value": comp_val

                            }
                        ]
                    })
                else:
                    json_data.append({
                        "name": country,
                        'id': country_id,
                        "year": year,
                        "cats": [
                            {
                                "name": "Resource revenues (US$)",
                                "value": resource
                            },
                            {
                                "name": comp,
                                "value": comp_val

                            }
                        ]
                    })
                    json_data[year_list[year]]["cats"][0]["value"] += resource
                    json_data[year_list[year]]["cats"][1]["value"] += comp_val



                current_report = row[0].strip()

        # write out archive of update into archive folder
        print_out = open('./' + file_name + '.json', 'w')
        print_out.write(json.dumps(json_data, indent=4, separators=(',', ':')))

if __name__ == "__main__":
    # main()
    main(sys.argv[1:])
