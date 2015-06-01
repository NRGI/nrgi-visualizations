#!/usr/bin/python
""" Converts eiti csv to json """
import json
import csv
import sys
import pycountry

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
        json_data = []

        for row in csv_reader:
            if row[0] == current_report:
                pass
            else:
                year = row[lkey['Year']]
                country = row[lkey['Country']]

                if country == "C\x93te d'Ivoire" or country == "C\xd2te d'Ivoire" or country == "C\xf4te d'Ivoire":
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

                resource = float(row[lkey['Total extractive government receipts (US$)']])
                if row[lkey[comp]] == '' or row[lkey[comp]] == '..' or row[lkey[comp]] == '#N/A':
                    comp_val = 0
                else:
                    comp_val = float(row[lkey[comp]])

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
                current_report = row[0].strip()

        # write out archive of update into archive folder
        print_out = open('./' + file_name + '.json', 'w')
        print_out.write(json.dumps(json_data, indent=4, separators=(',', ':')))

if __name__ == "__main__":
    # main()
    main(sys.argv[1:])
